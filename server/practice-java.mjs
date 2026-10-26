// Deliberately bounded teaching runtime. Never evaluates user text as JavaScript.
// Full Java compilation is supplied by the optional Docker runner.
const OPS = {
  '||': 1,
  '&&': 2,
  '==': 3,
  '!=': 3,
  '<': 4,
  '>': 4,
  '<=': 4,
  '>=': 4,
  '+': 5,
  '-': 5,
  '*': 6,
  '/': 6,
  '%': 6,
};
export function compilePractice(source) {
  if (typeof source !== 'string' || source.length > 4000)
    throw new Error('Keep this exercise under 4,000 characters.');
  const clean = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '').trim();
  const match = clean.match(
    /^public\s+static\s+boolean\s+canRegister\s*\(\s*int\s+([A-Za-z_]\w*)\s*\)\s*\{\s*return\s+([^;]+);\s*\}$/,
  );
  if (!match)
    throw new Error(
      'Practice mode supports the provided method with one return expression. Keep its signature and return a boolean. For full Java, enable the Docker runner.',
    );
  const variable = match[1],
    expression = match[2];
  const tokens =
    expression
      .match(/\s+|\d+|[A-Za-z_]\w*|>=|<=|==|!=|&&|\|\||[()+\-*/%!<>]/g)
      ?.filter((t) => !/^\s+$/.test(t)) ?? [];
  if (tokens.join('') !== expression.replace(/\s+/g, '') || tokens.length > 128)
    throw new Error(
      'Use numbers, the age parameter, comparisons, arithmetic, &&, ||, !, and parentheses.',
    );
  let index = 0,
    depth = 0;
  function primary() {
    if (++depth > 32) throw new Error('This expression is nested too deeply.');
    const token = tokens[index++];
    let node;
    if (['!', '-', '+'].includes(token)) {
      const arg = primary(),
        type = token === '!' ? 'boolean' : 'int';
      if (arg.type !== type) throw new Error(`Operator ${token} needs ${type} input.`);
      node = { op: token === '-' ? 'neg' : token === '+' ? 'pos' : '!', arg, type };
    } else if (token === '(') {
      node = parse(1);
      if (tokens[index++] !== ')') throw new Error('A closing parenthesis is missing.');
    } else if (token === variable) node = { op: 'age', type: 'int' };
    else if (token === 'true' || token === 'false')
      node = { op: 'literal', value: token === 'true', type: 'boolean' };
    else if (/^\d+$/.test(token ?? '') && Number(token) <= 2147483647)
      node = { op: 'literal', value: Number(token), type: 'int' };
    else throw new Error(`Unexpected token: ${token ?? 'end of expression'}.`);
    depth--;
    return node;
  }
  function parse(min) {
    let left = primary();
    while ((OPS[tokens[index]] ?? 0) >= min) {
      const op = tokens[index++],
        right = parse(OPS[op] + 1);
      const logical = ['&&', '||'].includes(op),
        equality = ['==', '!='].includes(op);
      if (
        left.type !== right.type ||
        (logical && left.type !== 'boolean') ||
        (!logical && !equality && left.type !== 'int')
      )
        throw new Error(`Incompatible types for ${op}.`);
      left = { op, left, right, type: OPS[op] <= 4 ? 'boolean' : 'int' };
    }
    return left;
  }
  const ast = parse(1);
  if (index !== tokens.length) throw new Error(`Unexpected token: ${tokens[index]}.`);
  if (ast.type !== 'boolean')
    throw new Error('canRegister must return a boolean comparison, not a number.');
  function evaluate(node, age) {
    if (node.op === 'age') return age;
    if (node.op === 'literal') return node.value;
    if (node.op === '!') return !evaluate(node.arg, age);
    if (node.op === 'neg') return -evaluate(node.arg, age) | 0;
    if (node.op === 'pos') return evaluate(node.arg, age);
    const a = evaluate(node.left, age);
    if (node.op === '&&' && !a) return false;
    if (node.op === '||' && a) return true;
    const b = evaluate(node.right, age);
    switch (node.op) {
      case '>':
        return a > b;
      case '>=':
        return a >= b;
      case '<':
        return a < b;
      case '<=':
        return a <= b;
      case '==':
        return a === b;
      case '!=':
        return a !== b;
      case '&&':
        return a && b;
      case '||':
        return a || b;
      case '+':
        return (a + b) | 0;
      case '-':
        return (a - b) | 0;
      case '*':
        return Math.imul(a, b);
      case '/':
      case '%':
        if (b === 0) throw new Error('ArithmeticException: / by zero');
        return node.op === '/' ? Math.trunc(a / b) | 0 : a % b;
    }
  }
  return (age) => evaluate(ast, age);
}

export const SAMPLE_AGES = [17, 18, 19];
export const REVIEW_AGES = [-2147483648, -100, -1, 0, 1, 16, 20, 21, 42, 99, 130, 2147483647];
export function judgePractice(source, submit = false) {
  const fn = compilePractice(source);
  const tests = SAMPLE_AGES.map((age) => ({
    name: `Age ${age}`,
    input: age,
    expected: age >= 18,
    actual: fn(age),
  }));
  const publicPassed = tests.every((test) => test.actual === test.expected);
  const reviewPassed = submit ? REVIEW_AGES.every((age) => fn(age) === age >= 18) : null;
  return {
    tests,
    passed: publicPassed && (!submit || reviewPassed),
    reviewPassed,
    runtime: 'practice',
  };
}
