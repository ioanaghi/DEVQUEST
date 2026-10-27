
DEVQUEST — Mission Pipeline System
Game Design Document · Phase 02 · Learning & Interview System
Acum ajungem la partea care poate face DEVQUEST cu adevărat special: cum transformăm un concept de programare într-o aventură completă, în care înveți, experimentezi, scrii cod, primești feedback și ajungi să poți rezolva singur probleme de interviu.
Nu vreau ca personajul să intre într-o cameră, să citească teoria despre HashMap, să rezolve trei exerciții și să primească XP.
Vreau să existe o poveste și un motiv real pentru care trebuie să învețe acel concept.
1. Structura universală a unei aventuri educaționale
Fiecare concept important din Java, SQL, OOP sau DSA primește propriul Mission Arc, compus din mai multe misiuni conectate.
Mission Arc: Learning Pipeline
9 etape

01 · The Incident
Apare o problemă reală la firmă

02 · Investigation
Descoperi datele și cerințele

03 · Discovery
Înțelegi vizual conceptul

04 · First Attempt
Încerci o soluție simplă

05 · The Twist
O nouă constrângere schimbă problema

06 · Optimization
Descoperi soluția eficientă

07 · QA & Edge Cases
Testezi și repari cazurile-limită

08 · Code Review
Explici complexitatea și abordarea

09 · Interview Challenge
Rezolvi independent o problemă nouă
La finalul unei astfel de aventuri, jucătorul ar trebui să poată explica singur ce este conceptul, când îl folosește, de ce funcționează, ce complexitate are și cum îl recunoaște într-o problemă nouă.

2. Prima aventură completă: The Checkout Incident
￼



blog.elest.io
The Checkout Incident
Beginner DSA
Chapter 03 · HashMap Foundations · Two Sum Pattern
50–70 min
Durată estimată
Java
Limbaj
HashMap
Concept principal
Povestea
Este vineri, ora 16:45. La PixelByte Studios, echipa lucrează la aplicația unui client, BentoCart, o platformă de cumpărături online.
BentoCart lansează o funcție prin care clienții pot folosi exact două vouchere pentru a acoperi valoarea unei comenzi.
Dar funcția nu este gata și lansarea este aproape.
Pentru o comandă de 100 de credite, utilizatorul are vouchere de 20, 45, 80 și 55 de credite. Sistemul trebuie să găsească două vouchere diferite care însumează exact 100.
Soluția există: 45 + 55.
Problema? Implementarea actuală este prea lentă când un utilizator are foarte multe vouchere.
Tu ești developerul care primește ticketul.
Personajele din aventură
￼



Alex — Senior Software Engineer
Mentorul tău. Explică problemele, pune întrebări și te ajută să descoperi soluțiile, fără să îți scrie codul.
Locație: Developer Office

￼



Maya — QA Engineer
Îți testează implementarea și descoperă cazuri-limită. Este foarte atentă la detalii și puțin sarcastică.
Locație: Testing Desk

￼



Nora — Product Manager
Îți explică problema clientului, criteriile de acceptare și ce se întâmplă dacă sistemul nu funcționează.
Locație: Meeting Corner

￼



Eva — Tech Lead & Interviewer
Apare la finalul aventurii. Îți pune întrebări ca la un interviu tehnic, îți verifică explicațiile și îți oferă un challenge necunoscut.
Locație: Interview Room
Fiecare personaj va avea dialoguri prestabilite, mici animații și reacții diferite în funcție de progresul jucătorului.

3. Pipeline-ul efectiv — 9 misiuni conectate
Mission 01 — Emergency Meeting
STORY · 3 MIN
Discovery
Locație: Meeting Corner NPC: Nora, Product Manager
Jucătorul primește o notificare pe telefonul virtual:
New message · Nora
„Hey! Avem o problemă cu noul sistem de vouchere. Poți veni la mine? Clientul așteaptă un update.”
New Quest
Jucătorul merge la Nora, apasă E, iar aceasta îi arată pe un ecran o comandă de 100 de credite și patru vouchere.
Nora: „Clientul vrea să plătească folosind exact două vouchere. Sistemul trebuie să aleagă două care însumează fix valoarea comenzii.”
Nora: „Nu mă interesează dacă voucherele au aceeași valoare, atâta timp cât sunt două vouchere diferite. Crezi că poți construi funcția?”
Exercițiu interactiv
Pe ecran apar patru vouchere. Jucătorul trebuie să selecteze două.
Voucher Matcher
Target: 100
20Voucher 1
45Voucher 2
80Voucher 3
55Voucher 4
Selected total
0 / 100
Selectează două vouchere.
Reset selection
Aceasta este o demonstrație interactivă a primului exercițiu. Jucătorul nu vede încă Java, HashMap sau Big O.
Ce învață: să înțeleagă problema, datele de intrare, constrângerile și rezultatul așteptat.
La succes, Nora îi spune:
„Nice! Dar acum imaginează-ți că un client are 10.000 de vouchere. Nu putem să le verificăm manual. Du-te la Alex!”
Reward: +25 XP · Quest 02 unlocked

Mission 02 — Understanding the Data
FOUNDATIONS · 5 MIN
Locație: Developer Office NPC: Alex, Senior Developer
Alex deschide pe monitor o listă de vouchere și începe să explice problema din perspectiva unui programator.
Alex: „Nora ți-a explicat problema din perspectiva clientului. Hai să o transformăm într-o cerință tehnică. Avem un array de numere și un target.”
Alex: „Dar atenție! Nu vrem să returnăm valorile voucherelor. Vrem indicii lor din array.”
Exercițiul 02A — Index Detective
Array Explorer
index 0
20
index 1
45
index 2
80
index 3
55
Target: 100
Expected answer: indices [1, 3], deoarece valorile sunt 45 și 55.
Jucătorul trebuie să răspundă la întrebări precum: ce valoare are vouchers[2], care este indexul voucherului de 55 și de ce indexul 1 nu reprezintă primul element în Java?
Exercițiul 02B — Contractul funcției
Primește un schelet de cod Java:
public static int[] findPair(int[] vouchers, int target) {
    // Your implementation goes here
}
În joc, contractul funcției ar fi explicat prin trei cartonașe interactive: Input → Process → Output.
Reguli pe care jucătorul trebuie să le confirme:
* Returnează doi indici diferiți dacă există o pereche validă.
* Dacă nu există o pereche, returnează un array gol.
* Pot exista valori identice și valori negative.
* Dacă există mai multe perechi, este acceptată oricare dintre ele.
Ce învață: arrays, indexing, metodă Java, parametri, return type și clarificarea cerințelor — toate esențiale la interviuri.
La final, Alex îi arată următorul ticket.

Mission 03 — The Obvious Solution
CODING · 8 MIN
Locație: Your Workstation NPC: Alex
Alex: „Hai să ignorăm momentan performanța. Care ar fi cea mai simplă metodă prin care am putea verifica toate perechile?”
Alex: „Nu trebuie să fie optimă. Trebuie mai întâi să fie corectă.”
Exercițiu: First Working Implementation
Jucătorul primește un editor Java gol și un hint vizual: doi roboței se deplasează printre vouchere, verificând fiecare pereche posibilă.
PixelByte IDE
Brute Force
public static int[] findPair(int[] vouchers, int target) {
    // Check possible pairs
    // Return the two different indices
    return new int[0];
}
Starter code: implementarea este incompletă intenționat.
Soluția așteptată pentru această etapă folosește două bucle și verifică perechile fără a reutiliza același element.
Jucătorul primește feedback imediat la rulare, dar nu codul corect.
Test	Input	Rezultat așteptat
Standard	[20,45,80,55], target 100	[1,3]
Duplicates	[50,50], target 100	[0,1]
No match	[10,20,30], target 100	[]
Negative numbers	[-5,2,9], target 4	[0,2]
La final:
Alex: „Perfect. Codul e corect și trece testele. Dar am observat ceva...”
Se deblochează următoarea misiune.
Reward: +100 XP · First Working Solution achievement

Mission 04 — The Performance Disaster
ALGORITHM ANALYSIS · 5 MIN
Locație: Developer Office NPC: Alex + Nora
Aceasta este întorsătura poveștii.
Nora se apropie de biroul tău. Pe monitor apare o notificare:
Performance Alert
The checkout matching system is processing too many candidate pairs.
Ticket #204 · Optimize voucher matching
Nora: „Funcționează pentru patru vouchere. Dar unul dintre clienții noștri are zeci de mii. Ce facem?”
Alex: „Hai să analizăm câte combinații verifică algoritmul tău.”
Exercițiu: Complexity Simulator
Un simulator arată câte perechi trebuie verificate în cel mai rău caz pentru algoritmul cu două bucle.
Brute Force Cost Simulator
O(n²)
Number of vouchers
100

Possible pairs
4,950
În cel mai rău caz, algoritmul verifică toate perechile de indici diferiți.
￼
Numărul de perechi crește aproximativ cu pătratul dimensiunii inputului.

Jucătorul descoperă prin experiment ce înseamnă O(n²) și de ce un algoritm care pare rapid pe un array mic poate deveni costisitor.
Nu îi predăm Big O doar printr-o formulă. Îl lăsăm să observe fenomenul.
Alex: „Dacă verificarea fiecărei perechi e problema, oare putem evita să comparăm fiecare element cu toate celelalte?”
Se deblochează sala de algoritmi.

Mission 05 — The HashMap Lab
CONCEPT DISCOVERY · 8 MIN
Locație: Training Room NPC: Alex
Intrând în Training Room, jucătorul găsește o masă virtuală cu sertare. Fiecare sertar reprezintă o asociere dintre o cheie și o valoare.
HashMap Interactive Lab
Key → Value
20Key
45Key
80Key
Selectează o cheie pentru a afla valoarea stocată.
Alex: „Imaginează-ți că ai putea verifica rapid dacă ai mai întâlnit o anumită valoare. Exact asta ne ajută să facem HashMap.”
Alex: „În Java, putem asocia valoarea unui voucher cu indexul lui. Dar cum ne ajută asta să găsim o pereche?”
Exercițiile din laborator
Jucătorul învață prin interacțiune să folosească put(), get() și containsKey(), apoi descoperă cum funcționează perechile cheie–valoare.
Mai învață de ce un HashMap oferă operații de căutare de regulă O(1) în medie, dar nu garantează acest cost în orice situație.
La final, are o provocare de descoperire:
„Ai un voucher în valoare de 45 și trebuie să ajungi la 100. Ce valoare ar trebui să cauți în HashMap?”
Răspunsul este 55.
Jucătorul descoperă astfel ideea de complement: target - currentValue.

Mission 06 — The Optimization Breakthrough
CODING · 10 MIN
Locație: Your Workstation NPC: Alex
Alex: „Acum știi cum funcționează HashMap. Crezi că poți găsi perechea într-o singură parcurgere?”
Alex: „Nu uita: fiecare voucher poate fi folosit o singură dată.”
Jucătorul revine la codul său din Mission 03 și primește o nouă cerință:
Optimize findPair() to O(n) expected time.
Obiectivele sunt să parcurgă array-ul o singură dată, să folosească HashMap<Integer, Integer>, să găsească un complement și să întoarcă doi indici diferiți.
Hinturi progresive
Încearcă singur. Indiciile sunt opționale și nu modifică automat codul.
0/4 hints
Reveal hint
După ce soluția trece testele funcționale, jocul verifică și obiectivul de performanță. Putem folosi teste pe inputuri mari și, în evaluarea controlată, instrumentare sau analiză care să confirme comportamentul liniar, fără să ne bazăm exclusiv pe timpul de execuție.
Optimization accepted!
Toate testele funcționale au trecut. Implementarea îndeplinește cerința de eficiență.
Expected time: O(n) · Extra space: O(n)
În momentul succesului, personajul face o animație de celebrare, monitorul clipește verde, iar Alex reacționează.
Alex: „That's what I'm talking about! Ai transformat o soluție bună într-una care poate suporta mult mai multe date.”

Mission 07 — Maya Breaks Everything
TESTING · 7 MIN
Locație: QA Desk NPC: Maya
Când crezi că problema este rezolvată, Maya îți trimite un mesaj.
Maya: „Hey, am văzut că ai trecut toate testele. Cute. Acum hai să vedem dacă îți pot strica funcția.”
Maya: „Ce se întâmplă dacă avem două vouchere identice? Sau un singur voucher care valorează exact cât comanda?”
Test Case Challenge
Maya prezintă cinci cazuri. Pentru fiecare, jucătorul trebuie să prezică rezultatul înainte să execute codul.
Scenariu	Input	Ce verifică
Twin Vouchers	[50,50], 100	Două valori egale, indici diferiți
Lonely Voucher	[100], 100	Nu se folosește același index de două ori
Empty Wallet	[], 100	Array gol
Refund Credit	[-20,120], 100	Valori negative
No Matching Pair	[10,25,30], 100	Lipsa unei soluții
Maya îi cere să repare eventualele buguri și să scrie cel puțin două teste suplimentare.
Dacă o soluție eșuează, Maya oferă feedback legat de cazul respectiv, nu rezolvarea.
Maya: „Ai returnat același index de două ori. Dar chiar avem două vouchere sau ai folosit unul de două ori?”
Ce învață: edge cases, test-driven thinking, contracte ale funcțiilor și identificarea erorilor logice.
La succes primește badge-ul QA Survivor.

Mission 08 — The Code Review
INTERVIEW THEORY · 7 MIN
Locație: Meeting Room NPC: Alex
Acum nu mai este suficient ca programul să funcționeze. Trebuie să poți explica de ce funcționează.
Alex: „La un interviu nu este suficient să scrii cod corect. Interviewerul vrea să înțeleagă cum gândești. Imaginează-ți că eu nu am văzut implementarea ta.”
Alex: „Explică-mi de ce ai ales HashMap în loc de două bucle.”
Code Review Challenge
Jucătorul are patru obiective:
1. Să identifice complexitatea soluției brute force.
2. Să explice de ce HashMap reduce numărul de căutări necesare.
3. Să determine complexitatea medie de timp și spațiu a soluției optimizate.
4. Să explice de ce verificarea complementului înainte de inserare previne folosirea aceluiași voucher de două ori.
Fără AI, putem evalua aceste obiective prin alegeri argumentate, completarea unor pași logici, asocierea conceptelor și selectarea unei justificări corecte. Nu vom pretinde că un simplu sistem de keyword matching înțelege explicații libere.
Un exemplu de întrebare
Why does the optimized solution use O(n) extra space?

Because Java creates a new array for every loop iteration.

Because the HashMap may store up to n previously visited values.

Because HashMap always stores n² elements.
La final, Alex aprobă code review-ul.

Mission 09 — The Interview Room
FINAL CHALLENGE · 10–15 MIN
Locație: Interview Room NPC: Eva, Tech Lead
Aceasta este prima simulare reală de interviu tehnic.
În cameră există o masă, două scaune și un whiteboard. Personajul se așază, Eva deschide un editor nou și apare o problemă pe care jucătorul nu a văzut-o în forma respectivă.
Eva: „Welcome! Today I'd like you to solve a problem involving transaction amounts.”
Eva: „Take your time to understand the requirements. You're free to ask for clarification before writing code.”
Final Interview Challenge — Transaction Reconciliation
Primești un array de valori ale tranzacțiilor și un target. Trebuie să identifici indicii a două tranzacții diferite a căror sumă este targetul.
Inputurile pot include duplicate, valori negative și cazuri fără soluție. Se cere o implementare cu timp mediu O(n).
Jucătorul trece printr-un mini-interviu cu etape fixe:
12345
Interview phase 1 / 5
Understanding the problem
Jucătorul alege întrebări de clarificare: pot exista duplicate, este garantată o soluție, ce trebuie returnat?
PreviousNext phase
Prototip interactiv al etapelor interviului; evaluarea reală va fi conectată la editorul de cod și sistemul de teste.
Evaluarea finală
Interview Scorecard
Criteriu	Punctaj
Code correctness	40
Algorithm efficiency	25
Edge cases	15
Reasoning & communication	20
Total	100
Rezultatul nu trebuie să fie doar „Passed / Failed”.
Dacă jucătorul rezolvă problema, dar nu reușește să explice complexitatea, primește feedback precis și posibilitatea de a exersa doar partea respectivă.
Dacă se blochează, poate folosi hinturi și poate termina interviul în Practice Mode. Pentru badge-ul de mastery trebuie ulterior să reușească o provocare independentă, fără indicii.
La promovare:
Eva: „Well done! You understood the problem, explained your approach and delivered an efficient solution.”
Eva: „Your next challenge? Recognizing when a HashMap isn't the right tool.”
Jucătorul iese din cameră și primește un achievement animat.

HashMap Detective
First interview concept mastered
+500 XP
New desk decoration

4. Cum legăm misiunile de lumea jocului
Ceea ce va diferenția DEVQUEST de un curs clasic este faptul că misiunile nu vor apărea doar într-un meniu. Ele vor modifica lumea din jurul personajului.
Quest World Flow
Meeting Corner — Nora
Primești problema și investighezi cerințele
Developer Office — Alex
Scrii prima soluție și descoperi limita ei
Training Room — HashMap Lab
Înveți conceptul și optimizezi soluția
QA Desk — Maya
Testezi implementarea și repari edge cases
Interview Room — Eva
Demonstrezi independent ce ai învățat
După finalizarea aventurii, firma poate să reacționeze la progres: Nora îți mulțumește pentru rezolvarea ticketului, Alex își schimbă dialogul, iar pe tabla echipei apare un mesaj că funcția de checkout a fost livrată.
Vreau și misiuni opționale, mici easter eggs și conversații cu colegii. Dar niciunul dintre acestea nu trebuie să blocheze progresul educațional.
5. Cum repetăm această structură pentru toate conceptele de interviu
Fiecare concept trebuie să aibă propria poveste și propriul tip de experiment. Nu schimbăm doar numerele sau numele variabilelor.
Concept	Titlul aventurii	Povestea și exercițiul principal
Arrays & HashMaps	The Checkout Incident	Găsești perechi de vouchere și optimizezi căutarea
Two Pointers	The Warehouse Mix-up	Sortezi și compari colete fără verificări inutile
Sliding Window	The Traffic Monitor	Găsești intervale problematice în fluxul de evenimente
Stack	The Broken Undo Button	Repari istoricul de acțiuni din editorul firmei
Binary Search	The Missing Release	Cauți eficient o versiune defectă într-o succesiune ordonată
Linked Lists	The Delivery Route	Repari o listă de opriri cu legături rupte
Trees	The File System Mystery	Explorezi o ierarhie de directoare și permisiuni
BFS & DFS	The Network Outage	Descoperi conexiuni și trasee într-o rețea de servere
Recursion	The Endless Folder	Explorezi structuri imbricate și înțelegi cazurile de bază
Dynamic Programming	The Resource Crisis	Optimizezi resursele reutilizând rezultate intermediare
SQL JOINs	The Missing Customer	Conectezi date din mai multe tabele pentru o investigație
OOP & SOLID	The Legacy Code Disaster	Refactorizezi o aplicație greu de extins
Testing	The Bug That Came Back	Construiești teste care previn regresiile
System Design	Black Friday Meltdown	Alegi arhitecturi care suportă creșterea traficului
Acestea sunt aventuri candidate, nu toate conținutul primului MVP.
6. Sistemul de mastery și progres
Un aspect esențial: nu considerăm că cineva a învățat HashMap doar pentru că a trecut o dată prin poveste.
HashMap — Skill Progression
Example
Discovered
100%

Ai observat problema și ai văzut conceptul
Practiced
100%

Ai folosit HashMap cu ghidaj
Applied
100%

Ai implementat și testat o soluție
Interview Ready
65%

Ai rezolvat independent o variantă nouă
Mastered
0%

Ai demonstrat că poți reutiliza conceptul ulterior
Exemplu de profil de progres, nu date reale ale unui jucător.
Aș introduce ulterior un mecanism de revenire asupra conceptelor: după alte câteva misiuni, jucătorul primește o problemă scurtă în care trebuie să recunoască singur că HashMap este alegerea potrivită.
Astfel, jocul verifică și retenția, nu doar memorarea unei soluții proaspăt explicate.
7. Cum implementăm misiunile fără AI
Pentru a scala până la zeci sau sute de misiuni, aș construi un sistem în care fiecare misiune este definită prin date, nu programată complet de la zero.
Mission Definition
Mission ID
├── Title & description
├── Prerequisite skills
├── Starting NPC and location
├── Dialogue sequence
├── Objectives & interactions
├── Lesson / visualization
├── Coding exercise
│   ├── Starter code
│   ├── Public test cases
│   ├── Hidden test cases
│   └── Performance requirements
├── Prewritten hints
├── Completion conditions
├── Rewards
└── Next missions
Un Quest Engine va urmări stările locked, available, active și completed. Separat, vom avea un sistem de evaluare care verifică efectiv codul și competențele demonstrate.
Dialogurile și hinturile sunt scrise de noi, iar testele sunt deterministe. Nu există un chatbot ascuns care decide arbitrar dacă răspunsul este bun.

