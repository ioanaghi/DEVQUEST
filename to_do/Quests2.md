# &#x20;DEVQUEST — Season 1: The Junior Developer Chronicles

Game Design Document · Phase 03 · New Concepts, Stories & Interview Quests

Continuăm povestea de la PixelByte Studios! După ce jucătorul a învățat Arrays & HashMaps în The Checkout Incident, începem o serie de aventuri care îl învață cele mai importante patternuri de interviu și, în paralel, cum gândește un Software Engineer la job.

Vreau să facem din fiecare concept un episod memorabil, cu personaje, conflicte, experimente vizuale, cod scris de jucător și un interviu final care verifică dacă a înțeles cu adevărat.

## Season 1 — Mission Board

PixelByte Career Progression

9 story arcs

01 · The Checkout Incident

Arrays & HashMaps

02 · The Warehouse Mix-up

Two Pointers

Next

03 · The Midnight Traffic Spike

Sliding Window

04 · The Broken Undo Button

Stacks

05 · The Cursed Release

Binary Search

06 · The Delivery Chain

Linked Lists

07 · The Endless Folder

Recursion & Trees

08 · The Missing Customer

SQL JOINs

09 · The Legacy Code Disaster

OOP & SOLID

Ordinea narativă propusă; în joc, SQL și OOP vor avea și trasee de studiu accesibile independent, cu prerechizite proprii.

# Episode 02 — The Warehouse Mix-up

Concept: Two Pointers

Beginner

[Скриншоты Ready, Steady, Ship! - галерея, снимки экрана, скриншоты](https://images.openai.com/static-rsc-4/PXHatOlhD2LpscZUHPKaYcdmjXv6hy71UJ-THE1U08fsQCpSkUsLBhYp2EieQEhK-9rwR1HE8_H1VvYHaR87lDSGEdtzIcKqEuUyzCtZY2uW6Vop_Dmd39dqRX4H48c2TPQxZZaR0NARTUZQztSB4Z1OmUB2AsxxhZGU-BPBL6A?purpose=inline)

[playground.ru](https://www.playground.ru/gallery/ready_steady_ship/?utm_source=chatgpt.com)

## Povestea

BentoCart a lansat noul sistem de vouchere, dar acum depozitul automatizat are o problemă.

Un robot trebuie să aleagă două colete a căror greutate însumată este exact limita unui container. Coletele sunt deja sortate crescător după greutate, însă robotul verifică toate combinațiile și pierde prea mult timp.

NPC-uri: Nora (Product Manager), Max (Warehouse Engineer), Alex (Senior Developer), Maya (QA).

### Pipeline-ul misiunilor

| Quest                     | Cu cine vorbești și ce se întâmplă                               | Exercițiul                                                           |
| ------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| 01 — Warehouse Alert      | Nora te trimite să investighezi blocajul robotului.              | Alegi manual două colete cu suma cerută.                             |
| 02 — Meet Max             | Max îți arată că toate coletele sunt deja sortate.               | Identifici proprietățile unui array sortat.                          |
| 03 — Robot Arms           | Alex îți prezintă doi roboți care pornesc de la capetele benzii. | Controlezi două pointere pentru a găsi perechea.                     |
| 04 — First Implementation | Revii la workstation.                                            | Implementezi `findPairSorted()` în Java.                             |
| 05 — Memory Limit         | Max îți spune că robotul are memorie limitată.                   | Compari HashMap O(n) spațiu cu Two Pointers O(1) spațiu suplimentar. |
| 06 — The Duplicate Crates | Maya introduce colete cu greutăți identice.                      | Testezi duplicate, array-uri mici și lipsa soluției.                 |
| 07 — Code Review          | Alex verifică algoritmul.                                        | Explici când funcționează Two Pointers și de ce.                     |
| 08 — Interview            | Eva îți dă o problemă nouă.                                      | Verifici dacă un text este palindrom folosind doi pointeri.          |

### Momentul interactiv: Robot Arms

Jucătorul vede un conveyor belt. Un braț robotic pornește de la cel mai ușor colet, iar altul de la cel mai greu.

Trebuie să decidă ce braț să mute pentru a găsi greutatea dorită.

Warehouse Robot Simulator

Target: 13 kg

1

L

3

\#1

5

\#2

6

\#3

8

\#4

11

R

Current sum

# 1 + 11 = 12

Array-ul este sortat. Analizează suma și alege pointerul de mutat.

&#x20;Move L

&#x20;Move R

Restart simulation

### Coding challenge

```
public static int[] findPairSorted(int[] weights, int target) {
    // Return the indices of two distinct weights
    // that add up to target.
    return new int[0];
}
```

Cerință: timp O(n), spațiu suplimentar O(1), folosind faptul că datele sunt sortate. Nu este permisă construirea unui HashMap.

### Interview Boss — The Secret Password

Eva îți dă o problemă diferită: într-o aplicație, anumite parole trebuie să fie palindromice după eliminarea caracterelor care nu sunt litere sau cifre și ignorarea diferențelor dintre majuscule și minuscule.

De exemplu, `"A man, a plan, a canal: Panama"` trebuie să fie acceptat.

Metoda:

```
public static boolean isPalindrome(String password)
```

Aici testăm dacă jucătorul poate transfera ideea de Two Pointers într-o problemă cu stringuri, nu doar să reproducă metoda cu colete.

Reward: Dual Pointer Badge, +350 XP și două brațe robotice decorative pentru birou.

# Episode 03 — The Midnight Traffic Spike

Concept: Sliding Window — fixed & variable

Beginner → Medium

[As AI coding agents mature, metrics follow a familiar enterprise path](https://images.openai.com/static-rsc-4/hqo9nHxWSzCNifxEumrww7eL0dLebWECe_eQVv4CFspB2eicCkJikUwvcs6t4FRV4RaXGuABZJ5tBdJzVeryCMMPLfmAhRW9cvd5xi73lhO-x_2rF92aj9fSt4qbjir8n7iLW_gJ4cwA02RLLtNbPtqd0lakSLOXoN0i5J3qRkw?purpose=inline)

[tessl.io](https://tessl.io/blog/as-ai-coding-agents-mature-metrics-follow-a-familiar-enterprise-path/?utm_source=chatgpt.com)

## Povestea

La miezul nopții, aplicația BentoCart începe să primească foarte multe cereri. Unele servere încetinesc, iar echipa nu știe în ce interval a apărut problema.

Personaj nou: Theo, Site Reliability Engineer. Poartă ochelari, are o colecție de stickere Linux pe laptop și o obsesie pentru grafice.

> Theo: „Am milioane de evenimente în loguri. Am nevoie să găsim intervalul de cinci minute cu cel mai mare număr de requesturi.”
>
> Alex: „Putem calcula suma fiecărui interval. Dar trebuie să recalculăm totul de fiecare dată?”

### Pipeline-ul misiunilor

| Quest                        | NPC / Story                                              | Learning challenge                                                              |
| ---------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 01 — Pager Alert             | Theo te cheamă în Server Room.                           | Citești un grafic cu requesturi pe minute.                                      |
| 02 — The Five-Minute Mystery | Theo te ajută să identifici intervalele consecutive.     | Calculezi manual sumele pentru ferestre de lungime k.                           |
| 03 — The Moving Window       | Alex introduce ideea de Sliding Window.                  | Muți o fereastră și actualizezi suma eliminând un element și adăugând altul.    |
| 04 — Fix the Monitor         | Scrii primul algoritm optimizat.                         | Implementezi `maxRequests()` în O(n).                                           |
| 05 — The Session Problem     | Theo descoperă o problemă cu identificatorii de sesiune. | Înveți ferestre de lungime variabilă.                                           |
| 06 — The Duplicate Event     | Maya introduce cazuri-limită.                            | Repari erorile de actualizare a ferestrei și tratezi duplicatele.               |
| 07 — Interview Room          | Eva te intervievează.                                    | Rezolvi un challenge nou de tip longest substring without repeating characters. |

### Experiment vizual

Server Traffic Monitor

Window: 3 min

3

1

8

2

4

3

12

4

6

5

9

6

2

7

7

8

Window [1–3]

# 3 + 8 + 4 = 15

Calculează prima sumă, apoi mută fereastra.

&#x20;PreviousSlide Window&#x20;

Jucătorul trebuie să observe că pentru a muta fereastra nu trebuie să adune din nou toate valorile; poate scădea elementul care iese și adăuga elementul nou.

### Exercițiul de coding

```
public static int maxRequests(int[] requests, int k)
```

Returnează suma maximă a oricăror `k` minute consecutive. Pentru MVP definim explicit `1 <= k <= requests.length`.

Apoi, într-un laborator separat, jucătorul învață o fereastră variabilă care se extinde și se micșorează în funcție de o condiție.

### Interview Boss — The Session Tracker

```
public static int longestUniqueSession(String events)
```

Fiecare caracter reprezintă tipul unui eveniment. Trebuie să găsească lungimea celui mai lung interval continuu fără caractere repetate.

Exemplu: `"abcaef"` → `5`, corespunzător substringului `"bcaef"`.

Obiective finale: O(n) timp și spațiu O(min(n, A)), unde A este dimensiunea alfabetului permis.

Reward: Traffic Analyst Badge, un monitor cu grafice animate și acces la noua cameră, Debugging Lab.

# Episode 04 — The Broken Undo Button

Concept: Stack, LIFO, Deque

Beginner

[Stop Speedrunning Claude Code (Master the Core Loop First)](https://images.openai.com/static-rsc-4/WBV-BO39Ahp5epXZaOjTj-CfSy-3rymP4xHMgQpUg3ISAaa7e6OP34bkWUdGGulP-fAyrmwW8I3nAFMQzaeOFRBhak0M1w4Sxf0f_-yIDae7SBNPRSO5DFb7LU3dX0aKnKt3Eb-7zkJFMIj5CptCA9FsBmNyk5a-uq0Gq0sP-6c?purpose=inline)

[paddo.dev](https://paddo.dev/blog/stop-speedrunning-claude-code/?utm_source=chatgpt.com)

## Povestea

PixelByte dezvoltă un editor de design pentru un client. În timpul unei demonstrații, designerul șterge din greșeală mai multe elemente, apasă Undo și descoperă că editorul restaurează acțiunile în ordinea greșită.

Un personaj nou, Lia — Frontend Developer, vine la biroul tău:

> Lia: „Am șters un buton, apoi un text, apoi o imagine. Când apăs Undo, ce crezi că ar trebui restaurat prima dată?”
>
> Alex: „Ultima acțiune trebuie anulată prima. Există o structură de date făcută exact pentru asta.”

### Quest Pipeline

| Quest                   | Story & NPC                                      | Exercițiu                                                                         |
| ----------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------- |
| 01 — UI Disaster        | Lia îți arată editorul defect.                   | Refaci manual ordinea corectă a acțiunilor Undo.                                  |
| 02 — Stack of Actions   | Alex te duce la training board.                  | Adaugi și scoți elemente dintr-un stack animat.                                   |
| 03 — Push & Pop         | Exersezi operațiile `push`, `pop` și `peek`.     | Prezici conținutul stackului după o secvență de operații.                         |
| 04 — Fix Undo           | Lia îți oferă un ticket Java.                    | Construiești istoricul acțiunilor folosind un stack.                              |
| 05 — Redo Is Broken Too | Clientul vrea să poată reveni după Undo.         | Implementezi două stackuri: Undo și Redo.                                         |
| 06 — Maya's Chaos Test  | Maya testează apăsări repetate și istoricul gol. | Gestionezi operațiile invalide și ștergerea istoricului Redo după o acțiune nouă. |
| 07 — Interview Boss     | Eva îți prezintă un fragment de cod necunoscut.  | Verifici dacă parantezele sunt echilibrate.                                       |

### Minigame — The Stack Tower

Jucătorul vede o coloană de blocuri colorate. Poate adăuga sau elimina doar blocul din vârf.

Undo / Redo Simulator

LIFO

Undo stack

Change color

Create button

Redo stack

Empty

&#x20;New actionUndoRedo

Experimentează cu Undo, Redo și New action. O acțiune nouă golește istoricul Redo.

### Interview Boss — The Corrupted Configuration

Eva primește fișiere de configurare care conțin paranteze rotunde, pătrate și acolade.

```
public static boolean isValidBrackets(String source)
```

Pentru această misiune, caracterele care nu sunt paranteze se ignoră. `"{[()]}"` este valid, dar `"{[(])}"` nu este.

Ce trebuie să demonstreze: de ce ultimul simbol de deschidere trebuie verificat primul, cum funcționează un stack și de ce algoritmul are O(n) timp și O(n) spațiu în cel mai rău caz.

Reward: Undo Wizard Badge + un mini terminal retro pentru birou.

# Episode 05 — The Cursed Release

Concept: Binary Search & Monotonic Conditions

Beginner → Medium

[The UEFN Server Performance Exploit Explained: Hard-Armoring Your Unreal Engine Netcode - horizOn Blog](https://images.openai.com/static-rsc-4/nDBGXEDF19HQ7DagQHQ2rVJC8BqwrPr7lqXsFKhTmk6giqIk6H8SMlGNnZBijueYYZlJ-3Vs4DP4ujLyPpuqT6l6iiLi4OThIzeGmeB0NPlANLnlZTbmSm-qhMVtCBWYE6QCo27pD2kdb0009aa_Qwn3pmXG_s1AdL0rhhgt-bY?purpose=inline)

[horizon.pm](https://horizon.pm/blog/the-uefn-server-performance-exploit-explained-hard-armoring-your-unreal-engine-netcode?utm_source=chatgpt.com)

## Povestea

PixelByte a lansat 1.024 de versiuni succesive ale unui serviciu într-un mediu de testare. La un moment dat, o modificare a introdus un bug, iar toate versiunile ulterioare din acest experiment au continuat să îl aibă.

Theo vrea să găsească prima versiune defectă. Dar rularea suitei de teste este costisitoare și nu pot verifica fiecare versiune.

> Theo: „Știm că versiunile sunt ordonate și că după prima versiune defectă toate următoarele au același bug.”
>
> Alex: „Atunci nu trebuie să verificăm fiecare versiune. Putem elimina jumătate din posibilități după fiecare test.”

### Quest Pipeline

| Quest                    | NPC / Story                                                           | Exercițiu                                                      |
| ------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------- |
| 01 — Failed Deployment   | Theo îți arată istoricul versiunilor.                                 | Identifici ce înseamnă prima versiune defectă.                 |
| 02 — The Guessing Game   | Alex organizează un joc cu numere ordonate.                           | Alegi mijlocul și elimini jumătate din interval.               |
| 03 — Release Timeline    | Theo deschide o hartă vizuală a versiunilor.                          | Găsești prima valoare `true` dintr-o secvență `false...true`.  |
| 04 — First Binary Search | Scrii implementarea Java.                                             | Implementezi `firstFailingBuild()`.                            |
| 05 — Off-by-One Bug      | Maya descoperă un caz în care algoritmul sare peste răspuns.          | Repari limitele `left`, `right` și actualizarea lui `mid`.     |
| 06 — No Bad Releases     | Theo introduce cazuri în care toate versiunile sunt bune sau defecte. | Verifici marginile intervalului.                               |
| 07 — Interview Boss      | Eva schimbă problema.                                                 | Găsești poziția de inserare a unui număr într-un array sortat. |

### Coding challenge

```
public static int firstFailingBuild(boolean[] failing)
```

Exemplu:

`[false, false, false, true, true, true]` → `3`

Se folosește indexare de la zero. Dacă nu există versiuni defecte, se returnează `-1`.

Cerințe: O(log n) timp și O(1) spațiu.

În puzzle-ul vizual, fiecare test colorează jumătate dintre versiuni ca eliminate. La succes, jucătorul vede comparația dintre Linear Search și Binary Search.

Worst-case comparison — 1,024 versions

Linear Search

1,024 checks

Binary Search

Up to 11 checks

În această comparație, Binary Search identifică prima versiune defectă în cel mult 11 verificări, folosind proprietatea de monotonie.

### Interview Boss — Find the Insertion Point

```
public static int searchInsert(int[] numbers, int target)
```

Eva oferă un array sortat și cere indexul unde există targetul sau unde ar trebui inserat pentru a păstra ordinea. Jucătorul trebuie să explice și cum evită depășirea limitelor, inclusiv calculând `mid` fără risc de overflow.

Reward: Binary Search Specialist + acces la Release Control Room.

# Episode 06 — The Delivery Chain

Concept: Linked Lists & Fast/Slow Pointers

Medium

## Povestea

BentoCart are un sistem de livrări care organizează opririle unei rute într-un lanț de noduri. Fiecare oprire ține referința către următoarea.

Un bug a modificat ordinea opririlor, iar Max vrea să poată inversa o rută fără să creeze o copie completă a listei.

> Max: „Fiecare oprire știe doar cine urmează. Nu avem un array cu toate opririle.”
>
> Alex: „Asta înseamnă că trebuie să fim foarte atenți când modificăm referințele. Dacă pierdem legătura către următorul nod, pierdem restul rutei.”

### Quest Pipeline

| Quest                        | NPC / Story                                                      | Exercițiu                                     |
| ---------------------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| 01 — Route Gone Wrong        | Max prezintă traseul defect.                                     | Urmărești nodurile unui linked list.          |
| 02 — Follow the Next Pointer | Alex introduce `Node`, `value` și `next`.                        | Conectezi și deconectezi noduri vizual.       |
| 03 — Reverse the Route       | Max cere inversarea listei.                                      | Reordonezi referințele fără să pierzi noduri. |
| 04 — Java Implementation     | Revii la workstation.                                            | Implementezi inversarea iterativă.            |
| 05 — The Missing Node        | Maya introduce listă goală și listă cu un singur nod.            | Verifici cazurile-limită.                     |
| 06 — The Infinite Route      | Un șofer virtual raportează că aplicația repetă aceleași opriri. | Descoperi ciclurile și pointerii slow/fast.   |
| 07 — Interview Boss          | Eva îți oferă o listă necunoscută.                               | Detectezi dacă lista conține un ciclu.        |

### Vizualizarea conceptului

Linked List — Before

10

20

30

40

After reversing

40

30

20

10

### Exercițiul Java

```
class ListNode {
    int value;
    ListNode next;
}

public static ListNode reverseList(ListNode head)
```

Cerință: O(n) timp, O(1) spațiu suplimentar.

### Interview Boss — The Endless Delivery Route

```
public static boolean hasCycle(ListNode head)
```

Jucătorul trebuie să descopere de ce doi pointeri care avansează cu viteze diferite pot detecta un ciclu folosind O(1) spațiu suplimentar.

Reward: Linked List Navigator și un robot de livrări care se poate plimba prin birou.

# Episode 07 — The Endless Folder

Concept: Recursion, Call Stack & Trees

Medium

[The Role of a Professional Library in Enterprise Architecture - Blog - Zachman International - FEAC Institute](https://images.openai.com/static-rsc-4/kAl4ibD4hfmpajvKC8jWZMgWi4ZsyRWPlwzoRQhBJ1SCXTwt9EEDtmLgEwzV1udcHXC1tFqlQLI9e3wYaldGiPyftCqpOT3Mt8rrpY5uMn4CtkhhtRgI6-2LDutOENi2HD0M5GFijMRLN9kCXgB-NIzKthJ4xXmrHoeD_lW3MUc?purpose=inline)

[zachman-feac.com](https://zachman-feac.com/resources/blog/the-role-of-a-professional-library-in-enterprise-architecture?utm_source=chatgpt.com)

## Povestea

Echipa dezvoltă o aplicație care analizează fișierele dintr-un sistem de stocare. Un client are foldere în interiorul altor foldere, iar aplicația trebuie să numere toate fișierele.

Problema este că nimeni nu știe cât de adâncă este structura.

Personaj nou: Iris — Backend Engineer, specialistă în organizarea datelor și structuri recursive.

> Iris: „Avem foldere în foldere, uneori pe zeci de niveluri. Nu putem scrie câte o buclă pentru fiecare nivel.”
>
> Alex: „Dar dacă am trata fiecare folder exact la fel, indiferent cât de adânc este?”

### Quest Pipeline

| Quest                           | NPC / Story                                                            | Exercițiu                                                    |
| ------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| 01 — Archive Emergency          | Iris prezintă directoarele clientului.                                 | Explorezi un arbore de foldere.                              |
| 02 — The Folder Inside a Folder | Alex explică ideea unei probleme care se repetă pe structuri mai mici. | Descompui o problemă în subprobleme.                         |
| 03 — The Recursive Robot        | Un robot intră în fiecare subfolder.                                   | Alegi condiția de oprire și pasul recursiv.                  |
| 04 — Count Every File           | Iris deschide editorul Java.                                           | Implementezi o funcție recursivă care numără fișiere.        |
| 05 — Call Stack Lab             | Alex îți arată apelurile funcției.                                     | Urmărești vizual intrarea și revenirea din apeluri.          |
| 06 — Stack Overflow             | Maya introduce structuri foarte adânci.                                | Analizezi riscul de stack overflow și alternative iterative. |
| 07 — Interview Boss             | Eva îți prezintă un binary tree.                                       | Calculezi adâncimea maximă a arborelui.                      |

### Exercițiul principal

```
public static int countFiles(Folder root)
```

Modelul `Folder` conține o colecție de fișiere directe și o colecție de subfoldere, fără cicluri. Funcția trebuie să numere toate fișierele, inclusiv cele din orice subfolder.

În lecția despre Call Stack, jucătorul vede cum fiecare apel este pus pe o stivă virtuală și cum rezultatele se întorc treptat.

### Interview Boss — Deepest Directory

```
public static int maxDepth(TreeNode root)
```

Pentru un arbore binar gol, rezultatul este 0. Pentru un arbore cu un singur nod, rezultatul este 1.

Obiectivul este O(n) timp și O(h) spațiu pe stiva apelurilor, unde h este înălțimea arborelui.

Reward: Recursion Explorer și o bibliotecă pixel-art pentru birou.

# Episode 08 — The Missing Customer

Concept: SQL JOINs, LEFT JOIN & NULL

Beginner → Medium

[Save 90% on Song of Farca on Steam](https://images.openai.com/static-rsc-4/smtNy6XYCBytVeu4PgQmVTWcAzrn2Zb9ZR9qa4MOX71hCBtkJLK74_6JcEdrmzAM5uPBdrNJ5WIElORXqDrs3xaDIT3ohlJtUpU_CKA1ePq5NnHu1_hm_oIjT7N5TC_a3BcPqO8CIAdOmL_NQbuaG1Z_vqpQtPYYmUknYmCFun0?purpose=inline)

[store.steampowered.com](https://store.steampowered.com/app/1435670/Song_of_Farca/?utm_source=chatgpt.com)

## Povestea

În departamentul de Customer Support, mai mulți clienți susțin că și-au creat conturi, dar nu apar în dashboardul echipei.

Nora este convinsă că datele au dispărut.

Însă Iris, Backend Engineer, are o altă suspiciune:

> Iris: „Am verificat baza de date. Conturile există.”
>
> Nora: „Atunci de ce nu apar în dashboard?”
>
> Iris: „Cineva a modificat query-ul. Cred că problema nu este în date, ci în modul în care legăm tabelele.”

### Quest Pipeline

| Quest                        | NPC / Story                                  | Exercițiu                                                                         |
| ---------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------- |
| 01 — Missing Customers       | Nora raportează dispariția unor utilizatori. | Identifici informațiile necesare investigației.                                   |
| 02 — Database Access         | Iris îți oferă acces la baza de date locală. | Explorezi tabelele `customers` și `orders`.                                       |
| 03 — Detective SELECT        | Cauți manual clienții.                       | Exersezi SELECT, WHERE și ORDER BY.                                               |
| 04 — The Relationship        | Iris îți explică primary key și foreign key. | Conectezi vizual comenzile cu proprietarii lor.                                   |
| 05 — INNER JOIN Trap         | Dashboardul exclude clienții fără comenzi.   | Descoperi de ce un INNER JOIN poate elimina anumite rânduri.                      |
| 06 — LEFT JOIN Investigation | Alex îți cere să găsești toți clienții.      | Scrii un LEFT JOIN și analizezi valorile NULL.                                    |
| 07 — Fix the Dashboard       | Maya rulează verificările.                   | Identifici toți clienții fără comenzi și gestionezi mai multe comenzi per client. |
| 08 — Interview Boss          | Eva îți oferă o schemă nouă.                 | Găsești comenzile care nu au plăți asociate.                                      |

### Interactive Database Lab

SQL Detective · JOIN Lab

Interactive

customers

1 · Ana

2 · Mihai

3 · Sara

4 · David

orders

\#101 → Customer 1

\#102 → Customer 2

\#103 → Customer 2

INNER JOINLEFT JOIN

Query Result

| Customer | Order ID |
| -------- | -------- |
| Ana      | #101     |
| Mihai    | #102     |
| Mihai    | #103     |

Observă: Sara și David nu apar, deoarece nu au nicio comandă asociată.

În editorul SQL real, jucătorul trebuie să scrie query-urile singur. Simulatorul servește doar la construirea intuiției.

### Interview Boss — Unpaid Orders

Eva oferă trei tabele: `customers`, `orders` și `payments`.

Jucătorul trebuie să găsească comenzile fără nicio plată asociată, incluzând numele clientului și identificatorul comenzii. Soluția trebuie să fie corectă și când un client are mai multe comenzi.

Reward: SQL Detective Level 2 + un panou de investigații decorativ.

# Episode 09 — The Legacy Code Disaster

Concept: OOP, Interfaces, Polymorphism & SOLID Foundations

Medium

[The producer path - by Sebastian Cardoso](https://images.openai.com/static-rsc-4/_DUGiZ3n5cSmdOyJ6taxRHhQjYtugHhlVi8xAUwyH8y4dLT-XCP_ZEppknpjJ7rT6nARThBi52wFSz0BRvKj7FvW0LoEQreioR5jiw0vEzjBkUdWvapRWxr7hvzs32-eXkMU72zppQgsCaNZDMBsWORV1TyqUTqr6bP97swejtw?purpose=inline)

[gamestudiounlocked.substack.com](https://gamestudiounlocked.substack.com/p/the-producer-path?utm_source=chatgpt.com)

## Povestea

BentoCart vrea să adauge noi metode de plată.

Dar codul existent are o problemă: funcția de procesare conține un lanț uriaș de condiții `if/else` pentru fiecare metodă de plată.

De fiecare dată când apare o metodă nouă, trebuie modificată funcția principală, iar câteodată se strică plățile existente.

Personaj nou: Victor — Software Architect, pasionat de clean code și arhitectură.

> Victor: „Codul acesta merge, dar este un coșmar de întreținut.”
>
> Alex: „Dacă fiecare metodă de plată ar respecta același contract, poate n-ar mai trebui să modificăm procesorul la fiecare schimbare.”

### Quest Pipeline

| Quest                       | NPC / Story                                             | Exercițiu                                                         |
| --------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| 01 — Payment Disaster       | Nora anunță că trebuie adăugată o nouă metodă de plată. | Citești și înțelegi codul existent.                               |
| 02 — The Giant If Statement | Victor prezintă problemele structurii actuale.          | Identifici responsabilități amestecate și cod duplicat.           |
| 03 — Object Workshop        | Alex explică clasele, obiectele și metodele.            | Construiești obiecte și le atribui comportamente.                 |
| 04 — Interface Contract     | Victor explică interfețele.                             | Definești un contract comun pentru metodele de plată.             |
| 05 — Polymorphism Lab       | Personajele folosesc metode de plată diferite.          | Rulezi implementări diferite prin aceeași interfață.              |
| 06 — Refactor the Processor | Revii la proiectul Java.                                | Refactorizezi procesarea folosind compoziție și interfețe.        |
| 07 — The New Payment Method | Nora cere încă o metodă nouă.                           | Extinzi sistemul fără modificări în logica centrală de procesare. |
| 08 — Regression Testing     | Maya verifică metodele existente.                       | Scrii și rulezi teste unitare.                                    |
| 09 — Architecture Interview | Victor și Eva organizează un interviu.                  | Aplici aceeași abordare unui sistem nou de notificări.            |

### Coding challenge

Codul din proiect ar putea porni de la o variantă asemănătoare cu aceasta:

```
public class PaymentProcessor {

    public void pay(String type, double amount) {

        if (type.equals("CARD")) {
            // Card payment logic
        } else if (type.equals("BANK")) {
            // Bank transfer logic
        } else if (type.equals("GIFT_CARD")) {
            // Gift card logic
        }

    }
}
```

Jucătorul va trebui să proiecteze un sistem în care strategiile concrete de plată implementează o interfață comună. Pentru simplitate, exemplul este schematic; în sistemul real vom folosi sume monetare reprezentate sigur, de exemplu cu `BigDecimal` sau unități întregi minime.

### Interview Boss — Notification System

Eva prezintă un serviciu care trimite notificări prin Email și SMS. Firma vrea acum și Push Notifications.

Jucătorul trebuie să propună și să implementeze o arhitectură extensibilă în care adăugarea unui canal nou nu obligă la modificarea logicii centrale.

Aici verificăm interfaces, polymorphism, composition, Single Responsibility și Open/Closed Principle prin cod și teste, nu doar prin memorarea definițiilor.

Reward: Clean Code Architect + upgrade pentru workstation și acces la Architecture Room.

# 10. Ce urmează după aceste nouă episoade

Odată ce jucătorul termină primele aventuri, se deschid alte ramuri de învățare.

| Track                    | Concepte viitoare                                | Exemplu de aventură               |
| ------------------------ | ------------------------------------------------ | --------------------------------- |
| Algorithms               | Sorting, Merge Sort, Quick Sort                  | The Sorting Factory               |
| Arrays                   | Prefix Sums, Intervals                           | The Financial Audit               |
| Trees                    | BST, Traversals, Heaps                           | The Search Engine Crisis          |
| Graphs                   | BFS, DFS, Topological Sort                       | The Network Blackout              |
| Advanced DSA             | Greedy, Backtracking, Dynamic Programming        | The Resource Optimization Project |
| Java                     | Collections, Generics, Exceptions, Streams       | The Java Training Program         |
| SQL                      | GROUP BY, HAVING, CTE, Window Functions, Indexes | The Financial Fraud Investigation |
| Backend                  | HTTP, REST APIs, Spring Boot, Authentication     | Build the PixelByte API           |
| Professional Engineering | Git, Pull Requests, Unit Testing, CI/CD          | The Production Release            |
| System Design            | Caching, Queues, Load Balancing, Concurrency     | Black Friday Meltdown             |

Aș introduce și interviuri mixte: după trei-patru concepte, Eva nu mai spune ce algoritm trebuie folosit. Jucătorul trebuie să recunoască singur patternul potrivit.

De exemplu, primește o problemă și trebuie să aleagă între HashMap, Two Pointers, Sliding Window sau Binary Search. Abia după ce analizează inputul și constrângerile începe implementarea.

## 11. Standardul fiecărei aventuri DEVQUEST

Pentru ca jocul să fie educațional și nu doar distractiv, propun să avem o definiție obligatorie pentru fiecare concept.

The DEVQUEST Learning Contract

1

Story

O problemă credibilă în contextul unui job

2

NPC Interaction

Cel puțin doi colegi care au roluri diferite

3

Visual Discovery

Un experiment vizual și interactiv

4

Guided Coding

Un exercițiu cu feedback și hinturi prestabilite

5

Independent Coding

Un exercițiu pe care îl rezolvi fără ajutor

6

Edge Cases

Teste publice și ascunse relevante

7

Code Review

Explicarea abordării și a complexității

8

Interview Boss

O problemă nouă care verifică transferul conceptului

9

Mastery Check

O provocare ulterioară, după alte misiuni

Și vreau să introducem o idee importantă: jucătorul poate termina povestea folosind hinturi, dar nu obține automat certificarea de mastery. Pentru certificare, are nevoie de o problemă nouă, rezolvată independent, cu teste de corectitudine și constrângeri de performanță.

Astfel, nu transformăm jocul într-o competiție despre viteză sau învățat soluții pe de rost.

## 12. Cum evoluează PixelByte Studios

Pe măsură ce termini aventurile, firma devine mai interesantă:

- După Two Pointers se deschide Warehouse Lab.
- După Sliding Window primești acces la Server Monitoring Room.
- După Stacks deblochezi un mic editor de design.
- După Binary Search poți explora Release Control Room.
- După Linked Lists primești un robot decorativ.
- După Recursion se deschide Archive Room.
- După SQL descoperi o nouă investigație secretă.
- După OOP, Victor te invită să participi la un proiect de arhitectură.

Aș lega aceste aventuri de un eveniment mai mare: PixelByte pregătește lansarea unei versiuni importante a BentoCart. Fiecare episod rezolvă câte o problemă care amenință lansarea. În finalul sezonului, toate sistemele pe care le-ai reparat contribuie la un release funcțional.

Aceasta poate fi prima mare realizare a personajului: nu doar că a trecut câteva teste de algoritmică, ci a contribuit la lansarea unui produs software, a învățat să colaboreze cu o echipă și a demonstrat că poate rezolva independent probleme tehnice.

Următorul pas de game design ar fi să transformăm aceste episoade într-un Mission Content Bible: pentru fiecare quest să scriem dialogul exact al NPC-urilor, obiectivele, datele de test, hinturile pe patru niveluri, răspunsurile acceptate, animațiile și condițiile de deblocare. Acesta ar deveni materialul de implementare pentru DEVQUEST.