# &#x20;DEVQUEST — From Intern to Senior Engineer

Game Design Document · Versiunea 1.0

Vreau să construim un joc care să transforme învățarea programării într-o experiență de tip Stardew Valley meets Software Engineering meets SQL Detective.

Ideea centrală: Nu înveți Java, SQL, OOP sau algoritmi pentru că un curs îți spune să îi înveți. Le înveți pentru că personajul tău are un job, colegi, probleme de rezolvat, deadline-uri, buguri misterioase și o carieră de construit.

Și cel mai important: fără AI care să îți dea soluțiile. Jocul te învață să gândești singur, să experimentezi, să greșești și să simți satisfacția când codul tău funcționează.

## 1. Cum ar arăta lumea jocului

[Pixel Art Programmer - Create Stunning Visuals | AI Art Generator | Easy-Peasy.AI](https://images.openai.com/static-rsc-4/VExzgqkUbCe2ypcNziKgZGsqVfqrjRiEjFz-EDPjmZqYPHEfwrHoeLEu_4CFLlLF3WpC9G9yz6gKr5h4oYJ1ab2iIPX6egCtSHXk9bxaGQyDYZLeEzhLIPdMc5YbGnw1AE1j4nmzfVsHhMrkFM4LdH0Y3XM28BLS2krR0aWp4m0?purpose=inline)

[会社情報 | カイロソフト](https://images.openai.com/static-rsc-4/ECnPhRk6yktf_65mWCmwhs_fqaePtuxKEKwZurdjujFKE7GhhhZ45hjas3LwXPTC1auf04clqtXwTwA6LBRHiJQCsinmzhhveRXTGUsACfnd8H9tzg-2Yhj-RgrWZhzXRA-S5WgR4J-yW1lMxZcMlbp5TAVqjmyiCVjWl5xcwYE?purpose=inline)

[LLMs for Level Design: Procedural Generation Prompts - VibeGames Blog | VibeGames.Ninja](https://images.openai.com/static-rsc-4/60-v6eGhjMxeiSwrxMIPv4B8A_sNUVeN2l9WENtRQNbuU48A2xyDqw3vn1JUjR4PTh28JerwoqHSjRlxCISSrH2gjI4MLMCuDXONfrYhUhF4mt3SikTERppYnn6jUpUOU-0SbYzQUH4We2_tAsKGbG4zUgCFWbwwiTP6nSAHBKc?purpose=inline)

12

Referințe pentru direcția vizuală: pixel art luminos, spații de lucru personalizabile, personaje expresive și multe detalii interactive. Nu copiem asseturile altor jocuri.

Jucătorul intră într-o firmă fictivă de software, de exemplu PixelByte Studios. Prima zi începe cu un email:

> Welcome aboard! 🎉
>
> You've joined PixelByte as a Junior Software Engineer.
>
> Your mentor is waiting in the training room. Your first task? Fix a bug before the clients notice.

Lumea ar avea mai multe camere, fiecare reprezentând o parte din viața de programator.

[Modern Office TOTAL Revamp - Modern Office - Revamped - RPG Tileset \[16x16\] by LimeZu](https://images.openai.com/static-rsc-4/iAX8xUMyfkoA1VHpsYGD9L8NzopteY-OMGlbRtU64cX5bmZ8jgoUUDtop9beHjyQ-KNnrmqqdfAA-c2BV-NAgDatCnCezMoxbvPVwNULLEO3woxbbOesa07rGpuWSkuSoNzpSxAZDceoZpw_VUWCh5ReVNoRjtlA3w6d5UHn_Zc?purpose=inline)

Developer Office

Taskuri reale, debugging, code reviews, Git și proiecte.

[Zeca Pixels - Character Life Simulation by Jabali AI](https://images.openai.com/static-rsc-4/BZsqxpJcJD0sedBnHbbswIZnp0UaITq-tR_TmTrap5p5imBWgiYFM3PIkf62snAEqYWe7FI6zBLdctM-pr5wPYNeE3GTBc_vgKMpnwDx3QDoQJKnBhPAWw0-2er_NAV416WVvmNWmJIeCjsGVs3s7vWbM1O_nWTiU-wIjRtWqlU?purpose=inline)

Training Academy

Java, OOP, SQL, teorie explicată vizual și exerciții.

[LLMs for Level Design: Procedural Generation Prompts - VibeGames Blog | VibeGames.Ninja](https://images.openai.com/static-rsc-4/60-v6eGhjMxeiSwrxMIPv4B8A_sNUVeN2l9WENtRQNbuU48A2xyDqw3vn1JUjR4PTh28JerwoqHSjRlxCISSrH2gjI4MLMCuDXONfrYhUhF4mt3SikTERppYnn6jUpUOU-0SbYzQUH4We2_tAsKGbG4zUgCFWbwwiTP6nSAHBKc?purpose=inline)

Algorithm Arena

DSA, LeetCode-style challenges, patternuri și interviuri.

[Steam Community :: Don't Forget Me](https://images.openai.com/static-rsc-4/y0-g3eCqcr4w3DhS84PgB-3qqvdgQhZ4tVopvn6iD5boQLF6gHiOmIkq-UzG21QX5QyYGbSB0cW9XpiE57BW7v_jkAGLUbNuT76aSs0NYSgGSWYoMKHvmZ7s8DswkPqKMAaJe8Qj_F5kSuNMW_kZmIMkaJTzM3hdz58HbD7RbSQ?purpose=inline)

Database Investigation Lab

Mistere rezolvate prin SQL, baze de date și investigații.

Personajul tău se poate deplasa prin firmă, interacționa cu colegii, deschide laptopul, participa la traininguri și rezolva probleme.

### Un ciclu de gameplay

Primești ticket

Înveți conceptul

Scrii cod

Rulezi teste

Livrezi taskul

Primești upgrade

Nu doar înveți concepte, ci le aplici, vezi consecințele muncii tale și simți că ai contribuit la ceva.

## 2. Harta completă de învățare

Vreau să separăm două obiective care se completează:

- Job Ready: să poți lucra într-o echipă, să înțelegi un proiect existent, să repari buguri, să scrii cod curat și să colaborezi.
- Interview Ready: să poți rezolva probleme de algoritmică, să explici complexitatea și să treci prin interviuri tehnice.

Nu sunt identice. Cineva poate fi foarte bun la LeetCode și să nu știe să lucreze cu Git sau să testeze un API.

Your career roadmap

10 capitole

01

Developer Foundations

Logică · Terminal · Git · Debugging

02

Java Fundamentals

Sintaxă · Metode · Arrays · Strings

03

Object-Oriented Programming

Classes · Interfaces · SOLID · Patterns

04

SQL & Databases

Queries · JOIN · Transactions · Indexes

05

Data Structures

Lists · Maps · Stacks · Trees · Graphs

06

Algorithms & Problem Solving

Search · Sorting · DP · Backtracking

07

Backend Engineering

HTTP · REST · Spring Boot · APIs

08

Professional Engineering

Testing · Git workflows · CI/CD · Security

09

System Design & Architecture

Caching · Queues · Scalability · Tradeoffs

10

Interview Tower

Coding rounds · SQL · OOP · Mock interviews

Fiecare capitol trebuie să aibă o poveste proprie, o serie de misiuni, mecanici interactive și un proiect final. Vom folosi curriculumul ca o hartă de competențe, nu ca o succesiune de lecții pasive.

## 3. Cum învățăm efectiv fiecare concept

Fiecare modul are trei componente:

Learn

Explicații scurte, animate și intuitive

Practice

Experimente și puzzle-uri interactive

Apply

Taskuri realiste, teste și proiecte

### Exemplu: OOP — Învață inheritance

Nu vrem o pagină cu definiția moștenirii urmată de cinci întrebări grilă.

Vrem ca utilizatorul să găsească un sistem de personaje dintr-un joc intern al firmei, unde fiecare personaj are cod duplicat.

Training: Object-Oriented Programming

Mission 04

[Pico Game — Quick & Fun Web Games](https://images.openai.com/static-rsc-4/edu3kA8vO3JjRLv9OOwe6zv9ZuILfKk5sMEbWlC79mRrHvq6kR5WqdnA3U8c9Qs8OIUh_VRQl4-zTcrW4e2CAtkYlLE1eYCdi_ONNR1b-NVzUhuMwlYprm94p3y48HZwQ9ZN9mSVWgMmV_7lGDI2WSQLxaTrv68CH_pCzYMK5-w?purpose=inline)

[pico-game.com](https://www.pico-game.com/?utm_source=chatgpt.com)

Your mentor says:

„Avem trei clase: Warrior, Mage și Archer. Toate au `health`, `name` și `takeDamage()`. Putem elimina duplicarea fără să stricăm comportamentul fiecăreia?”

Your objectives

&#x20;Identifică proprietățile comune

&#x20;Creează o clasă de bază `Character`

&#x20;Păstrează atacurile specifice fiecărui personaj

&#x20;Rulează toate testele

La final, când codul trece testele, personajele se animă și folosesc noul sistem. Asta înseamnă recompensă vizibilă, nu doar un mesaj „Correct Answer”.

Pentru subiecte ca încapsulare, polimorfism, interfețe, compoziție și design patterns, putem construi provocări complet diferite în aceeași lume.

## 4. Planul concret pentru fiecare capitol

| Capitol         | Ce trebuie să învețe                                                                                    | Tipul de gameplay                               |
| --------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Foundations     | Variabile, condiții, bucle, funcții, recursion basics, terminal, Git                                    | Repari programe, explorezi terminalul           |
| Java            | Tipuri, strings, arrays, metode, colecții, generics, exceptions, lambdas, streams                       | Scrii cod pentru funcționalități reale          |
| OOP             | Clase, obiecte, inheritance, polymorphism, interfaces, abstract classes, SOLID, design patterns         | Construiești și refactorizezi sisteme           |
| SQL             | SELECT, JOIN, GROUP BY, HAVING, subqueries, CTE, window functions, normalization, indexes, transactions | Investigații bazate pe date                     |
| Data Structures | Arrays, linked lists, stacks, queues, hash maps, sets, heaps, trees, graphs, tries                      | Vizualizezi și manipulezi structuri             |
| Algorithms      | Big O, sorting, binary search, two pointers, sliding window, BFS/DFS, greedy, backtracking, DP          | Puzzle-uri, boss fights, coding challenges      |
| Backend         | HTTP, JSON, REST, authentication, validation, Spring Boot, persistence, error handling                  | Construiești API-uri pentru clienți fictivi     |
| Engineering     | Git branching, pull requests, tests, mocks, logging, debugging, CI/CD, Docker basics, security          | Colaborezi cu echipa și livrezi funcționalități |
| System Design   | Caching, databases, queues, concurrency, scalability, reliability, observability                        | Proiectezi infrastructura firmei                |
| Interviews      | Problem solving, coding interviews, OOP și SQL questions, design tradeoffs, comunicare                  | Interviuri simulate cu evaluare obiectivă       |

Pentru Java, vom construi materia folosind și structura din documentația oficială [Dev.java](https://dev.java/learn/?utm_source=chatgpt.com). Pentru zona de interviuri, vom lega progresul de tiparele exersate în [LeetCode Study Plans](https://leetcode.com/studyplan/?utm_source=chatgpt.com).

Important: nu trebuie să fie obligatoriu să termini întregul Java înainte să ai acces la SQL sau algoritmi. Vom avea trasee paralele, cu prerechizite acolo unde sunt necesare.

## 5. LeetCode într-un joc care chiar te învață algoritmică

Aici cred că putem face una dintre cele mai bune părți ale proiectului.

Nu vom transforma pur și simplu problemele în întrebări cu cronometru. Vom transforma algoritmii în mecanici vizuale.

[Quantum Castle - Castillo de las Sumas \[Español\] - CHRONONEB GAMES](https://images.openai.com/static-rsc-4/pwuOooHNA1XKFkQhke-K09hIETToTRObFuQgdKIh5N-OzVHAhsbexIEjLFlU9B_53dm2pCxchEIiOdKfOGCb-a53mz-CCsZoDnG9p_SQIqW8TYtNLPvZBVL33CvOJ8Ki7a46hLuubMgpl6jz28KAPPdbxCzEPsEy-7Bg29bnwq4?purpose=inline)

Two Sum → Find the Matching Pair

Un depozit are cutii cu valori diferite. Trebuie să găsești două cutii care însumează o anumită valoare. Înveți brute force, HashMap și complexitatea.

[Dungeon Color on Steam](https://images.openai.com/static-rsc-4/31F3pKki_iWohYYnNtvrbghRAK_ZibFJiFqZQgMyEvELg_xMLO0Ph1LlOXyVgSvCM6HosdMeRT7ydXWeRzSnGGyey_7uHkjEksTVBpPZqL3CDW2nE88iJxGC1ZSG473mvr1IYulMqLUxNXZpo9bdwbIcCjNuDAjgaLNteVsIZSI?purpose=inline)

BFS / DFS → The Lost Server Maze

Un server a rămas izolat într-o rețea. Explorezi conexiunile, compari BFS cu DFS și găsești un traseu valid.

[Newsletter Archive | Subscription Index](https://images.openai.com/static-rsc-4/YnFZ_7SdY7TXkjb51cnMB-35ax5TuKPTA32z14wrniasemZi3RPV9MDCdwp5jSo0cOQTglj3RbWMSs_esHGTDbXLGv5gmxOh3IIeoNtfn9mO5zROwKQjb40RZq1YPurwTzu-n3cHlrQ-yHa82IAy9g7vyIOxm2Y9TSoWO76aVr8?purpose=inline)

Sorting → Warehouse Optimization

Roboții trebuie să sorteze comenzile. Vizualizezi Bubble Sort, Merge Sort și Quick Sort, comparând numărul de operații.

[8-Bit Pixelated Level Selector Map - Super Mario Style | AI Art Generator | Easy-Peasy.AI](https://images.openai.com/static-rsc-4/NX8AgEXW_k_6Br0FSMRBMkg3hNW081evYZUpQI2WcqRcX7cyNQa9b4Mom197lYX2Gvb3UaPuWpZE2qu4qSGCfay0rL_XAsQWzaTersnYLVq9ZSVehizv8jMjTTH4pNx0Q30VZ1Ulz9uHpUrrEjzUh2m-BTZYofo2sNol1exuGBg?purpose=inline)

Dynamic Programming → The Portal Network

Calculezi trasee optime între portaluri, păstrezi subproblemele rezolvate și descoperi memoization și tabulation.

### Progression system pentru DSA

Aș introduce patru tipuri de provocări:

1. Visual Lab: manipulezi structura și înțelegi cum funcționează.
2. Guided Challenge: primești o problemă nouă cu indicii despre strategie.
3. Independent Challenge: scrii singur algoritmul și treci teste ascunse.
4. Interview Challenge: rezolvi o problemă necunoscută, explici abordarea și analizezi complexitatea.

Vom scrie probleme originale construite pe aceleași patternuri de algoritmică. Pentru exerciții oficiale LeetCode, putem oferi legături către platformă, fără să copiem enunțuri protejate.

## 6. Sistemul de hinturi — fără AI

Aș face o diferență clară între a învăța și a primi răspunsul.

Hint System — Mission: Find the Duplicate

4 hint levels

Încearcă să găsești singur abordarea. Dacă te blochezi, dezvăluie un indiciu.

0 din 4 indicii dezvăluite

&#x20;Reveal next hint

Așa ar putea funcționa efectiv sistemul din joc. Hinturile sunt scrise și verificate dinainte, nu generate de un model AI.

Alte reguli pedagogice:

- Nu afișăm soluția completă înainte de o încercare reală.
- Greșelile arată ce test a eșuat și, când e potrivit, de ce.
- Nu penalizăm jucătorul pentru că greșește sau folosește indicii.
- Revenim periodic cu probleme similare, dar cu alt context.
- Pentru mastery, jucătorul trebuie să rezolve și o provocare independentă.

## 7. Satisfacție, niveluri și upgrade-uri

Career XP

# 2,450 XP

Level 8 · Junior Developer

Dev Coins

# 850

Pentru decorațiuni, skinuri și mobilier

Progresul învățării și recompensele cosmetice trebuie separate. XP-ul și accesul la misiuni reflectă competențele demonstrate, iar monedele deblochează lucruri distractive.

Ce putem debloca: birouri noi, calculatoare retro, plante, pisici de companie, haine, decorațiuni, noi zone în clădire și efecte vizuale pentru achievements.

[Tech Haven Workspace - backiee](https://images.openai.com/static-rsc-4/mayOXuTM_4YUYnR1MBcCUAGxQnRA6qWFDk7OSfita0sW-ImYFZ2TknBdrL0NE3uhAW788gZf6zijXlCqzo_udhtyujG3BXjerlUhEPohQG35TeL8iund_UBZVvfAnsgnGUKw3LMC85BZik2yXioc1uUF-MlVXbz0-ExCb1uF1OM?purpose=inline)

[Dev Log #4 A Week of Deep Integrations - DEV Community](https://images.openai.com/static-rsc-4/5xDWy7YgwHF_FFfmKVnuR2wWOs68og0G9nFbnW3wOwfukBny0rTt0-XXiGNZOmHl9YyTv1pmX6ZJBz2Im06ofvq9Km_3XPcjje4jQKp03zBfz3dDHa4Wuy0UaJprpR3ehGyjbm8JxkqMbWACaOCcvlYC4fQQ7JnIhbMne553WkQ?purpose=inline)

[Achievements - Official Kynseed Wiki from PixelCount Studios](https://images.openai.com/static-rsc-4/ugsNT7U8f7O5cuHDmSu5-4uv6uExPCJIGwBynAQXSbvYyOT11IAPusqH4cn26jXm_T8Ma45w5QfXzg81l7moBrxOVm5b0qNbcZHQkC7Pgjk5OJnXGGm421c4eQ_4muOd44NaVsNsz33ajuF0ECIFJTmUVYqB8k2rGhwHVszoOYc?purpose=inline)

14

Mi-ar plăcea să avem și un Developer Journal: o colecție cu toate conceptele pe care le-ai înțeles, explicațiile tale, bugurile rezolvate și cele mai bune soluții. Devine practic un portofoliu personal al progresului.

## 8. Primul MVP — o zi la PixelByte

Nu aș începe direct cu toate cele zece capitole. Aș construi un vertical slice: o porțiune mică, dar complet funcțională și reprezentativă pentru jocul final.

## Chapter 0: Your First Day

Primul prototip jucabil · 8 misiuni

1. Welcome to PixelByte

   Îți personalizezi personajul, primești badge-ul de angajat și explorezi biroul.
2. Meet Your Mentor

   Îl întâlnești pe Alex, un senior developer, care îți explică workflow-ul companiei.
3. Your First Bug

   Într-un mic exercițiu Java repari o condiție greșită. Rulezi primul test.
4. Training Time

   Înveți arrays și bucle printr-o animație interactivă.
5. The Missing Orders

   Un client susține că lipsesc trei comenzi. Deschizi baza de date și investighezi cu SQL.
6. Database Mystery

   Descoperi legătura dintre clienți și comenzile lor cu un JOIN.
7. Your First Code Review

   Repari o funcție, rulezi teste și trimiți modificarea la review.
8. First Day Completed!

   Primești primul achievement, o plantă pentru birou și acces la următoarele traininguri.

### Misiunea SQL: The Missing Orders

Am verificat câteva jocuri care folosesc această idee, precum SQL Murder Mystery și [SQLNoir](https://www.sqlnoir.com/?utm_source=chatgpt.com). Ambele arată că poți transforma interogările SQL în instrumente de investigare, nu doar în exerciții de sintaxă.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://mystery.knightlab.com\&sz=32)

mystery.knightlab.com

+1



Noi putem merge mai departe, integrând investigațiile într-o poveste despre o firmă de software.

Ticket #104 — Missing Orders

SQL · Beginner

Message from Alex

„Trei clienți au raportat comenzi dispărute. Verifică în baza de date comenzile care au statusul `pending`. Avem nevoie de ID-ul comenzii și ID-ul clientului.”

DATABASE SCHEMA

```
orders
├── id          INTEGER
├── customer_id INTEGER
├── total       DECIMAL
└── status      TEXT
```

SQL TERMINAL

SELECT id, customer_id FROM orders WHERE status = 'pending';

Example successful query

&#x20;3 rows found

În jocul real, terminalul ar fi editabil, ar executa SQL adevărat și ar verifica rezultatul. Query-ul de mai sus este doar un exemplu de rezolvare.

În misiunile următoare, problema devine mai complexă: JOIN-uri, statusuri contradictorii, tranzacții, audit logs și, în final, găsirea cauzei reale a bugului.

## 9. Cum l-am construi tehnic

Pentru că vrem să fie un joc 2D pixel-art, dar să poți și scrie SQL și Java într-un editor adevărat, aș alege o arhitectură web-first. Jucabilă pe laptop, direct în browser.

| Componentă   | Tehnologie                  | Rol                                     |
| ------------ | --------------------------- | --------------------------------------- |
| Game world   | Phaser                      | Hartă, personaje, animații, NPC-uri     |
| UI           | React + TypeScript          | Traininguri, jurnal, inventory, progres |
| Code editor  | Monaco Editor               | Editor similar cu VS Code               |
| SQL runtime  | `sql.js` / WebAssembly      | SQL real executat în browser            |
| Java runtime | Judge0 sau runner izolat    | Compilare, teste și feedback            |
| Save system  | Browser local, apoi backend | Salvarea progresului                    |
| Pixel art    | Aseprite / LibreSprite      | Personaje, obiecte și animații          |

Phaser suportă jocuri 2D în browser și TypeScript, Monaco oferă un editor de cod matur, iar sql.js poate executa SQLite local. Pentru Java ar trebui să folosim un mediu izolat, cu limite de timp și memorie — nu să executăm codul utilizatorilor direct pe serverul principal.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.phaser.io\&sz=32)

Phaser Help

+3



Nu avem nevoie inițial de login, multiplayer, AI sau un backend complicat. Putem începe cu un joc local, apoi adăuga conturi și sincronizarea progresului.

## 10. Ordinea în care l-am dezvolta

Etapa 1 — Game identity & art direction

Stabilim numele, povestea, stilul vizual, personajul, interfața, paleta de culori, dimensiunea pixelilor și harta firmei.

Etapa 2 — Lumea jucabilă

Construim biroul, mișcarea personajului, interacțiunile, dialogurile și sistemul de ticketuri.

Etapa 3 — Primul engine educațional

Integram editorul SQL, rularea query-urilor, validarea rezultatelor și hinturile.

Etapa 4 — Lecții și misiuni

Creăm primul capitol, cu explicații ilustrate, exerciții, teste și progres salvat.

Etapa 5 — Game feel & progression

Adăugăm XP, achievements, upgrade-uri, animații, sunete, jurnal și personalizarea biroului.

Etapa 6 — Java, OOP și Algorithm Arena

Extindem engine-ul pentru cod Java și teste ascunse, apoi implementăm laboratoarele DSA și exercițiile de interviu.

## 11. Deciziile mele pentru prima versiune

MVP scope

6/7 incluse

Perspectivă top-down, pixel art luminos, cu personaj controlabil

Joc de browser, optimizat inițial pentru laptop și desktop

O firmă fictivă, un mentor, un birou și un training room

Primele misiuni: debugging simplu și SQL detective

Editor de cod adevărat, teste automate și hinturi prestabilite

Salvare locală a progresului și un mic skill tree

Achievement la primul task și personalizarea biroului

Continuăm cu designul primului nivel&#x20;

Ce vreau să păstrăm ca principiu al întregului joc: fiecare mecanică trebuie să contribuie fie la înțelegerea unui concept, fie la satisfacția de a-l aplica. Jocul trebuie să fie suficient de interesant încât cineva să intre pentru încă o misiune, dar suficient de riguros încât după zeci de ore să poată scrie cod mai bun, să rezolve probleme de interviu și să fie mai pregătit pentru un job real.

Aș începe cu designul primului nivel și al biroului, apoi am face prima versiune jucabilă. Nu avem nevoie să construim întreaga firmă înainte să demonstrăm că ideea este distractivă.