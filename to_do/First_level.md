# &#x20;DEVQUEST — Designul primului nivel

Game Design Document · Phase 01 · PixelByte Studios

Vreau ca DEVQUEST să se simtă ca un joc indie pe care chiar ai vrea să îl joci seara, nu ca o platformă de cursuri cu un personaj care se plimbă între teste.

Pentru primul nivel vom construi o firmă mică de software, cu atmosferă cozy, culori vibrante, colegi simpatici și obiecte interactive. Învățarea trebuie să fie integrată natural în munca personajului.

## Chapter 01 — Your First Day

MVP

Durată țintă

20–30 min

Misiuni principale

2

Spații de joc

3 zone

Povestea: Ai fost angajat ca Junior Software Engineer la PixelByte Studios. Este prima ta zi, iar mentorul tău, Alex, îți pregătește onboardingul. Dar lucrurile nu merg perfect: o funcție Java conține un bug și au dispărut câteva comenzi din sistemul unui client.

Ca să termini prima zi, trebuie să rezolvi ambele probleme. Fără soluții generate de AI.

## 1. Identitatea vizuală

Aș alege direcția Cozy Pixel Tech: combinația dintre un RPG 2D luminos și un birou modern de software, cu detalii pline de personalitate.

[Modern Office - Revamped - RPG Tileset \[16x16\] by LimeZu](https://images.openai.com/static-rsc-4/sQp2BI-0mAwmqjU5yTuKmY8FvcuG1Ytz4N-kKBfBdhxWxlrSjpAGUPrm8AvDrHw0mJhzQsHGNy5AXP32cnYMUHvt1Eq5TqJaxFeqrm4JjyMS1jdAn_4Yf_YpE1FBInC8CO4Fo8W1RpuWwRXAsxw49O1dzOC-SEe15IFh9i-_GII?purpose=inline)

Lumea

Podele calde, plante, monitoare luminoase, mobilier colorat.

[Pixel Art Sprite Sheet for Games | Character Animation | AI Art Generator | Easy-Peasy.AI](https://images.openai.com/static-rsc-4/6vxw-5W1i4WN5fgK1eEqIp2HMwKVNVlCmRU8zdZz-Y43iEPPY4-YSWzES2CQomk5O2fUEeJ67CSvwFvb2dSvSegnemQ0e_DesMCnyrTVkasH_q7LuLQRslqY4U6boehErrF8K5SrV7Ulhd4c3NpXj0BFNTeYHFhLEVcK8z8rlZ8?purpose=inline)

Personajele

Sprite-uri expresive, animații scurte și haine personalizabile.

Referințe de stil, nu asseturi finale. Vom crea o identitate vizuală originală pentru DEVQUEST.

### Paleta noastră

Cream

Mint

Coral

Sky

Lilac

Ink

Reguli vizuale:

- Pixel art autentic, cu tile-uri de 16×16 px.
- Jocul este afișat mărit la scară întreagă, fără blur.
- Contururi în bleumarin închis, nu negru pur.
- Animații mici: monitoare care clipesc, plante care se mișcă, notificări, expresii și reacții ale NPC-urilor.
- Interfață modernă, lizibilă, inspirată vizual din jocurile pixel-art, fără să pixelăm excesiv textul sau codul Java.

## 2. Harta primului nivel

Aș construi o hartă mică, dar foarte bine decorată. Nu avem nevoie de zece camere goale. Avem nevoie de câteva spații în care fiecare obiect să aibă un rol.

## PixelByte HQ — Floor 1

Schiță vizuală originală a distribuției spațiilor. Mobilierul și sprite-urile vor primi ulterior asseturi pixel-art detaliate.

Mentor's Desk

Aici începe povestea

Your Workstation

Editorul de Java

Training Room

Lecții și concepte

SQL Terminal

Investigațiile SQL

### Specificațiile hărții

| Proprietate                       | Decizia pentru MVP                       |
| --------------------------------- | ---------------------------------------- |
| Dimensiune hartă                  | 40 × 25 tile-uri                         |
| Dimensiune tile                   | 16 × 16 px                               |
| Dimensiune hartă în pixeli logici | 640 × 400 px                             |
| Camera vizibilă                   | Aproximativ 30 × 18 tile-uri             |
| Perspectivă                       | Top-down 3/4, fără cameră izometrică     |
| Mișcare                           | WASD sau săgeți                          |
| Interacțiune                      | Tasta E                                  |
| Coliziuni                         | Pereți, mese, mobilier                   |
| Cameră                            | Urmărește personajul, cu limitele hărții |

### Obiectele interactive

Nu vreau obiecte care au doar rol decorativ. Fiecare cameră va avea mici surprize.

În Office, ai laptopul pentru taskuri, tabla cu ticketuri, mentorul Alex, o plantă decorativă de deblocat și un panou cu anunțuri amuzante.

În Training Room, ai un whiteboard care explică vizual concepte, laptopuri de exerciții și un terminal dedicat investigațiilor SQL.

În Coffee Corner, ai un spațiu mic, opțional, unde poți descoperi dialoguri cu colegii și câteva detalii despre lumea PixelByte. Nu îl vom transforma într-un sistem complicat pentru primul MVP.

Ca referință de producție, există tileseturi de birou 16×16 precum [Modern Office de LimeZu](https://limezu.itch.io/modernoffice?utm_source=chatgpt.com), sau pachete mai noi cu obiecte și personaje animate. Sunt utile pentru a înțelege cum se organizează asseturile; folosirea lor efectivă depinde de licență și de compatibilitatea stilului.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://bubbabba.itch.io\&sz=32)

itch.io

+1



## 3. Personajul principal

Personajul nu trebuie să fie prestabilit. Vreau ca jucătorul să își creeze propriul developer, astfel încât să se identifice cu progresul lui.

Developer Avatar

Direcția personajului

Un personaj mic, cu proporții simpatice, cap expresiv, mișcări energice și o siluetă recognoscibilă.

Prima personalizare: coafură, culoarea pielii, hoodie/tricou, culoarea hainelor și ochelari opționali.

Schiță de sprite pentru direcția artistică, nu assetul final de joc.

### Animațiile necesare

| Animație          | Când se folosește                         |
| ----------------- | ----------------------------------------- |
| Idle              | Personajul stă și respiră subtil          |
| Walk 4 directions | Deplasare prin birou                      |
| Typing            | Lucrează la calculator                    |
| Thinking          | Se confruntă cu un puzzle                 |
| Celebration       | Rezolvă un task                           |
| Interaction       | Vorbește cu NPC-uri sau folosește obiecte |

Pentru primul MVP vom avea mers în patru direcții, idle, typing și celebration. Restul pot apărea ulterior.

### Mentorul — Alex

Alex trebuie să fie un personaj memorabil, nu un chatbot care răspunde automat la orice.

Poartă un hanorac albastru, are o cană de cafea și este calm, amuzant, dar nu rezolvă taskurile în locul tău.

Exemplu de dialog când testele nu trec:

> Alex: „Hmm, două teste trec, unul nu. Ce e special la inputul care a picat? Uită-te întâi acolo.”

Dialogurile lui sunt scrise manual și declanșate de evenimente precise: prima interacțiune, un test eșuat, finalizarea misiunii sau deblocarea unei camere.

## 4. Designul interfeței

Vreau să avem două moduri UI diferite, pentru că explorarea și programarea au nevoi foarte diferite.

### Screen A — Exploration Mode

PIXELBYTE HQ

LVL 01

0 XP

ACTIVE QUEST

Meet Alex

Find your mentor in the office.

YOUR SKILLS

&#x20;Java Debugging

&#x20;SQL Basics

Office · Floor 1

Explore your office

WASD to move · E to interact

Alex · Senior Developer

Hey, welcome to PixelByte! Ready for your first day?

Press E to continue

Wireframe pentru organizarea UI-ului, nu o captură dintr-un joc funcțional. Harta pixel-art va ocupa zona centrală.

Pe laptop, HUD-ul trebuie să fie discret. Aș afișa permanent doar misiunea activă, nivelul și indicatorul de interacțiune. Skill tree, jurnalul și inventarul s-ar deschide la cerere.

### Screen B — Coding Mode

Când jucătorul se așază la calculator și apasă E, interfața trece într-un workspace de dezvoltare.

PixelByte IDE

Bug Ticket #001

Task: Fix the registration check

Users aged 18 or older should be allowed to register. One boundary case currently fails.

Registration.java

public static boolean canRegister(int age) {     return age > 18; }

&#x20;Age 17

&#x20;Age 18

&#x20;Age 19

2 of 3 sample tests pass

&#x20;Hint

&#x20;Run Code

În versiunea reală, codul va fi editabil în Monaco. Butonul Run Code execută testele publice, iar Submit validează soluția cu teste suplimentare. Un hint va explica un concept sau va orienta atenția, nu va modifica automat codul.

Pentru SQL folosim aceeași interfață, dar înlocuim editorul Java cu un SQL Query Editor și adăugăm panouri pentru Database Schema și Query Results.

## 5. Desfășurarea primei zile

Prolog — Welcome Aboard

Personajul apare la intrare. Primește o notificare și o săgeată discretă care îl conduce spre Alex. Jucătorul învață să meargă și să interacționeze.

Concept introdus: navigare · 2 minute

Mission 1 — The Registration Bug

Alex te trimite la primul calculator. Citești cerința, găsești eroarea de comparație, rulezi testele și livrezi primul fix.

Concept: debugging și boundary conditions · 5–7 minute

Mission 2 — The Missing Orders

Primești un ticket despre trei comenzi care nu apar în dashboard. Înveți SELECT, WHERE și JOIN prin mici demonstrații, apoi investighezi baza de date. Descoperi că datele există, dar dashboardul le filtrează greșit.

Concept: SQL filtering și JOIN · 10–15 minute

Epilog — Your First Upgrade

Alex te felicită, deblochezi primul achievement și alegi o decorațiune pentru biroul tău. Progresul este salvat.

Sistem introdus: recompense și personalizare · 2–3 minute

### Micul Skill Tree

First Day

Debugging

Java fundamentals

Java Basics

Next chapter

SQL Filtering

Queries and data

Advanced SQL

Next chapter

Acesta ar fi primul skill tree. Ulterior vom conecta fiecare competență cu prerechizite, niveluri de mastery și probleme independente.

## 6. Ce construim efectiv în prima versiune

Ca să nu ne pierdem într-un proiect imens, vreau să stabilim un criteriu clar: primul nivel trebuie să fie complet jucabil de la intrarea în firmă până la prima recompensă.

Acceptance checklist — Level 01

0/9

Harta poate fi explorată cu WASD, cu coliziuni și cameră

Personajul are idle, walk și typing animations

Alex oferă dialoguri și activează prima misiune

Editorul Java permite modificarea codului și rularea testelor

Terminalul SQL execută interogări pe o bază de date locală

Hinturile sunt prestabilite și pot fi dezvăluite progresiv

Finalizarea misiunilor oferă XP și achievements

Poți plasa prima decorațiune în birou

Reload-ul paginii păstrează misiunile, recompensele și codul salvat

Checklist de lucru, nu funcționalități deja implementate.

Pentru partea tehnică a MVP-ului, aș păstra progresul și codul local în browser la început. Harta și obiectele le definim separat de logica misiunilor, astfel încât să putem adăuga ulterior camere și capitole fără să reconstruim jocul.

## 7. Ce urmează în procesul nostru

Aș împărți următoarea etapă în trei livrabile foarte concrete: tilesetul și harta finală, sprite sheet-ul personajului și al mentorului, apoi interfața funcțională pentru primul ticket.

Prima demonstrație pe care vreau să o atingem este foarte simplă și foarte satisfăcătoare:

Jucătorul intră în birou, merge la Alex, primește un task, deschide laptopul, modifică singur codul, apasă Run, vede trei teste verzi și apoi personajul său face o mică animație de celebrare.

Dacă acea secvență este distractivă, avem fundația pentru întregul DEVQUEST. După aceea, SQL Detective, OOP Academy și Algorithm Arena pot folosi același sistem de interacțiuni, editor, teste, progres și recompense.
