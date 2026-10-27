// A bounded Java subset for the checkout arc. Source is parsed, never evaluated.
const precedence = {
  '||': 1,
  '&&': 2,
  '==': 3,
  '!=': 3,
  '<': 4,
  '<=': 4,
  '>': 4,
  '>=': 4,
  '+': 5,
  '-': 5,
  '*': 6,
  '/': 6,
  '%': 6,
};
export function compilePair(source) {
  if (typeof source !== 'string' || source.length > 8000)
    throw new Error('Keep your method under 8,000 characters.');
  const clean = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '').trim();
  const tokens =
    clean.match(/\d+|[A-Za-z_]\w*|\+\+|--|<=|>=|==|!=|&&|\|\||[{}()[\];,.<>+\-*/%=!]/g) ?? [];
  if (tokens.join('') !== clean.replace(/\s/g, '') || tokens.length > 2000)
    throw new Error(
      'Unsupported syntax. Use int variables, for/while loops, if, arrays and HashMap<Integer, Integer>.',
    );
  let pos = 0,
    depth = 0;
  const peek = () => tokens[pos];
  const take = (value) => {
    if (tokens[pos++] !== value) throw new Error(`Expected ${value} near token ${pos}.`);
  };
  const name = () => {
    const n = tokens[pos++];
    if (!/^[A-Za-z_]\w*$/.test(n ?? '')) throw new Error('Expected a variable name.');
    return n;
  };
  function expression(min = 1) {
    if (++depth > 40) throw new Error('Expression is nested too deeply.');
    let node;
    const t = tokens[pos++];
    if (['-', '+', '!'].includes(t)) node = { op: 'unary', sign: t, value: expression(7) };
    else if (t === '(') {
      node = expression();
      take(')');
    } else if (t === 'new') {
      take('int');
      take('[');
      if (peek() === ']') {
        take(']');
        take('{');
        const items = [];
        if (peek() !== '}') {
          items.push(expression());
          while (peek() === ',') {
            take(',');
            items.push(expression());
          }
        }
        take('}');
        node = { op: 'array', items };
      } else {
        const size = expression();
        take(']');
        node = { op: 'empty', size };
      }
    } else if (/^\d+$/.test(t ?? '')) {
      if (Number(t) > 2147483648) throw new Error('Integer literal out of range.');
      node = { op: 'literal', value: Number(t) };
    } else if (t === 'true' || t === 'false') node = { op: 'literal', value: t === 'true' };
    else if (/^[A-Za-z_]\w*$/.test(t ?? '')) node = { op: 'var', name: t };
    else throw new Error(`Unexpected expression: ${t ?? 'end of method'}.`);
    while (peek() === '[' || peek() === '.') {
      if (peek() === '[') {
        take('[');
        const index = expression();
        take(']');
        node = { op: 'index', object: node, index };
      } else {
        take('.');
        const member = name();
        if (member === 'length') node = { op: 'length', object: node };
        else {
          if (!['get', 'put', 'containsKey'].includes(member))
            throw new Error('Supported map operations: put, get, containsKey.');
          take('(');
          const args = [expression()];
          if (peek() === ',') {
            take(',');
            args.push(expression());
          }
          take(')');
          if (args.length !== (member === 'put' ? 2 : 1))
            throw new Error('Incorrect map argument count.');
          node = { op: 'map', object: node, member, args };
        }
      }
    }
    while ((precedence[peek()] ?? 0) >= min) {
      const op = tokens[pos++];
      node = { op, left: node, right: expression(precedence[op] + 1) };
    }
    depth--;
    return node;
  }
  function simple() {
    if (peek() === 'int' || peek() === 'Integer') {
      pos++;
      const variable = name();
      take('=');
      return { op: 'declare', name: variable, value: expression() };
    }
    if (peek() === 'HashMap' || peek() === 'Map') {
      pos++;
      take('<');
      take('Integer');
      take(',');
      take('Integer');
      take('>');
      const variable = name();
      take('=');
      take('new');
      take('HashMap');
      take('<');
      if (peek() !== '>') {
        take('Integer');
        take(',');
        take('Integer');
      }
      take('>');
      take('(');
      take(')');
      return { op: 'declareMap', name: variable };
    }
    const value = expression();
    if (['=', '++', '--'].includes(peek())) {
      if (value.op !== 'var') throw new Error('Only local variable assignment is supported.');
      const operator = tokens[pos++];
      return {
        op: 'assign',
        name: value.name,
        value:
          operator === '='
            ? expression()
            : {
                op: operator === '++' ? '+' : '-',
                left: value,
                right: { op: 'literal', value: 1 },
              },
      };
    }
    return { op: 'expr', value };
  }
  function statement() {
    if (++depth > 40) throw new Error('Statements are nested too deeply.');
    let node;
    if (peek() === '{') {
      take('{');
      const body = [];
      while (peek() && peek() !== '}') body.push(statement());
      take('}');
      node = { op: 'block', body };
    } else if (peek() === 'for') {
      take('for');
      take('(');
      const init = simple();
      take(';');
      const condition = expression();
      take(';');
      const step = simple();
      take(')');
      node = { op: 'for', init, condition, step, body: statement() };
    } else if (peek() === 'while') {
      take('while');
      take('(');
      const condition = expression();
      take(')');
      node = { op: 'while', condition, body: statement() };
    } else if (peek() === 'if') {
      take('if');
      take('(');
      const condition = expression();
      take(')');
      const yes = statement();
      let no;
      if (peek() === 'else') {
        take('else');
        no = statement();
      }
      node = { op: 'if', condition, yes, no };
    } else if (peek() === 'return') {
      take('return');
      node = { op: 'return', value: expression() };
      take(';');
    } else {
      node = simple();
      take(';');
    }
    depth--;
    return node;
  }
  take('public');
  take('static');
  take('int');
  take('[');
  take(']');
  take('findPair');
  take('(');
  take('int');
  take('[');
  take(']');
  const arrayName = name();
  take(',');
  take('int');
  const targetName = name();
  take(')');
  if (arrayName === targetName) throw new Error('Parameter names must be different.');
  const ast = statement();
  if (ast.op !== 'block' || pos !== tokens.length)
    throw new Error('Provide only the findPair method, without imports or a class wrapper.');
  return (values, target, limit = 300000) => {
    let operations = 0,
      mapReads = 0,
      mapWrites = 0;
    const tick = () => {
      if (++operations > limit)
        throw new Error(
          'Operation limit reached. Check your loop bounds or try a more efficient approach.',
        );
    };
    const integer = (v) => {
      if (!Number.isInteger(v))
        throw new Error('Expected an int value. Check your map lookup and variable types.');
      return v | 0;
    };
    const boolean = (v) => {
      if (typeof v !== 'boolean') throw new Error('Conditions must return boolean values.');
      return v;
    };
    const read = (scope, key) => {
      if (!scope.has(key)) throw new Error(`Unknown variable: ${key}.`);
      return scope.get(key);
    };
    function evalNode(n, scope) {
      tick();
      if (n.op === 'literal') return n.value;
      if (n.op === 'var') return read(scope, n.name);
      if (n.op === 'unary') {
        const v = evalNode(n.value, scope);
        return n.sign === '!' ? !boolean(v) : n.sign === '-' ? -integer(v) | 0 : integer(v);
      }
      if (n.op === 'array') return n.items.map((x) => integer(evalNode(x, scope)));
      if (n.op === 'empty') {
        const size = integer(evalNode(n.size, scope));
        if (size < 0 || size > 512) throw new Error('Practice arrays must contain 0–512 elements.');
        return Array(size).fill(0);
      }
      if (n.op === 'index' || n.op === 'length') {
        const a = evalNode(n.object, scope);
        if (!Array.isArray(a)) throw new Error('Expected an int array.');
        if (n.op === 'length') return a.length;
        const i = integer(evalNode(n.index, scope));
        if (i < 0 || i >= a.length) throw new Error(`Array index ${i} is out of bounds.`);
        return a[i];
      }
      if (n.op === 'map') {
        const map = evalNode(n.object, scope);
        if (!(map instanceof Map)) throw new Error('Expected a HashMap.');
        const args = n.args.map((x) => integer(evalNode(x, scope)));
        if (n.member === 'put') {
          mapWrites++;
          const old = map.get(args[0]);
          map.set(args[0], args[1]);
          return old ?? null;
        }
        mapReads++;
        return n.member === 'get' ? (map.get(args[0]) ?? null) : map.has(args[0]);
      }
      const a = evalNode(n.left, scope);
      if (n.op === '&&') return boolean(a) && boolean(evalNode(n.right, scope));
      if (n.op === '||') return boolean(a) || boolean(evalNode(n.right, scope));
      const b = evalNode(n.right, scope);
      if (n.op === '==') return a === b;
      if (n.op === '!=') return a !== b;
      const x = integer(a),
        y = integer(b);
      switch (n.op) {
        case '+':
          return (x + y) | 0;
        case '-':
          return (x - y) | 0;
        case '*':
          return Math.imul(x, y);
        case '/':
        case '%':
          if (!y) throw new Error('Division by zero.');
          return n.op === '/' ? Math.trunc(x / y) | 0 : x % y;
        case '<':
          return x < y;
        case '>':
          return x > y;
        case '<=':
          return x <= y;
        case '>=':
          return x >= y;
      }
    }
    function execute(n, scope) {
      tick();
      if (n.op === 'block') {
        const local = new Map(scope);
        for (const item of n.body) {
          const result = execute(item, local);
          if (result) return result;
        }
        for (const key of scope.keys()) scope.set(key, local.get(key));
      } else if (n.op === 'declare' || n.op === 'declareMap') {
        scope.set(n.name, n.op === 'declareMap' ? new Map() : integer(evalNode(n.value, scope)));
      } else if (n.op === 'assign') {
        read(scope, n.name);
        scope.set(n.name, integer(evalNode(n.value, scope)));
      } else if (n.op === 'expr') evalNode(n.value, scope);
      else if (n.op === 'return') {
        const value = evalNode(n.value, scope);
        if (!Array.isArray(value)) throw new Error('Return an int array.');
        return { value };
      } else if (n.op === 'if') {
        const branch = boolean(evalNode(n.condition, scope)) ? n.yes : n.no;
        if (branch) return execute(branch, scope);
      } else if (n.op === 'while') {
        while (boolean(evalNode(n.condition, scope))) {
          const result = execute(n.body, scope);
          if (result) return result;
        }
      } else if (n.op === 'for') {
        const loop = new Map(scope);
        execute(n.init, loop);
        while (boolean(evalNode(n.condition, loop))) {
          const result = execute(n.body, loop);
          if (result) return result;
          execute(n.step, loop);
        }
        for (const key of scope.keys()) scope.set(key, loop.get(key));
      }
    }
    const result = execute(
      ast,
      new Map([
        [arrayName, [...values]],
        [targetName, target],
      ]),
    );
    if (!result) throw new Error('Your method finished without returning an array.');
    return { value: result.value, operations, mapReads, mapWrites };
  };
}

export const PAIR_SAMPLES = [
  { name: 'Standard wallet', values: [20, 45, 80, 55], target: 100 },
  { name: 'Twin vouchers', values: [50, 50], target: 100 },
  { name: 'No matching pair', values: [10, 20, 30], target: 100 },
  { name: 'Refund credit', values: [-5, 2, 9], target: 4 },
];
function validResult(values, target, result) {
  if (result.length === 0)
    return !values.some((v, i) => values.some((w, j) => i < j && ((v + w) | 0) === target));
  return (
    result.length === 2 &&
    result.every((i) => Number.isInteger(i) && i >= 0 && i < values.length) &&
    result[0] !== result[1] &&
    ((values[result[0]] + values[result[1]]) | 0) === target
  );
}
export function judgePair({
  code,
  submit = false,
  optimized = false,
  interview = false,
  custom = [],
}) {
  const fn = compilePair(code);
  if (
    !Array.isArray(custom) ||
    custom.length > 5 ||
    custom.some(
      (c) =>
        !c ||
        !Array.isArray(c.values) ||
        c.values.length > 32 ||
        ![c.target, ...c.values].every((v) => Number.isInteger(v) && Math.abs(v) <= 1000000),
    )
  )
    throw new Error(
      'Custom tests need up to 32 integer values and an integer target (±1,000,000).',
    );
  const cases = interview
    ? [
        { name: 'Transaction reconciliation', values: [13, -4, 21, 8], target: 17 },
        { name: 'Repeated transactions', values: [6, 6], target: 12 },
        { name: 'Unmatched ledger', values: [7], target: 14 },
      ]
    : PAIR_SAMPLES;
  const check = (c) => {
    try {
      const r = fn(c.values, c.target);
      return {
        ...c,
        actual: r.value,
        passed: validResult(c.values, c.target, r.value),
        operations: r.operations,
      };
    } catch (error) {
      return { ...c, actual: null, passed: false, error: error.message };
    }
  };
  const tests = [...cases, ...custom.map((c, i) => ({ ...c, name: `Your test ${i + 1}` }))].map(
    check,
  );
  let reviewPassed = null,
    efficiencyPassed = null;
  if (submit) {
    const hidden = [
      { values: [], target: 100 },
      { values: [100], target: 100 },
      { values: [50], target: 100 },
      { values: [-20, 120], target: 100 },
      { values: [0, 0], target: 0 },
      { values: [2, 7, 11, 15], target: 9 },
      { values: [3, 2, 4], target: 6 },
      { values: [-7, -3, -8, 1], target: -10 },
      { values: [1, 8, 1, 8], target: 9 },
      ...Array.from({ length: 18 }, (_, i) => ({ values: [i + 4, 43 - i, -i, i + 4], target: 47 })),
    ];
    reviewPassed = hidden.every((c) => check(c).passed);
    if (optimized) {
      try {
        const a = fn(
          Array.from({ length: 128 }, (_, i) => i + 1),
          -1,
        );
        const b = fn(
          Array.from({ length: 256 }, (_, i) => i + 1),
          -1,
        );
        efficiencyPassed =
          a.value.length === 0 &&
          b.value.length === 0 &&
          b.mapReads >= 256 &&
          b.operations < 40000 &&
          b.operations / a.operations < 2.7;
      } catch {
        efficiencyPassed = false;
      }
    }
  }
  return {
    tests,
    reviewPassed,
    efficiencyPassed,
    passed:
      tests.every((t) => t.passed) &&
      (!submit || (reviewPassed && (!optimized || efficiencyPassed))),
    runtime: 'bounded-pair-java',
  };
}
