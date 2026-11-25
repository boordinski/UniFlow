# AGENTS.md — UniFlow

## 1. Contesto e obiettivo

UniFlow è un progetto software di gruppo per esplorare e simulare i flussi di mobilità nell’area universitaria di Trento.

Il sistema raccoglie dati da moduli distinti — per esempio lezioni, trasporto pubblico, meteo e parcheggi — li normalizza e li rende disponibili ai servizi che producono scenari o previsioni.

Aiuta il gruppo a mantenere il progetto comprensibile, coerente e verificabile. Non introdurre modifiche solo perché sembrano più moderne o complete: ogni intervento deve rispondere a una richiesta o a un problema concreto.

## 2. Lavorare nel progetto di gruppo

Il repository è condiviso da più membri, che possono avere responsabilità e contesti di lavoro diversi.

Prima di modificare il codice:

- leggi le istruzioni presenti nella cartella interessata e la documentazione pertinente;
- controlla lo stato del repository e le modifiche già presenti;
- individua il modulo e il comportamento coinvolti;
- segui i dati fino al punto in cui vengono usati;
- rispetta struttura, convenzioni e interfacce già adottate.

Non presumere che il codice o la documentazione locale descrivano tutto il lavoro degli altri membri. Se trovi modifiche non correlate o non attribuibili alla richiesta, preservale.

Intervieni nel perimetro richiesto. Non modificare il lavoro di un altro modulo o membro del gruppo solo per uniformarlo alle tue preferenze. Se una modifica condivisa è necessaria, spiega l’impatto sui componenti coinvolti e coordina la decisione con l’utente.

Non inviare messaggi ai membri del gruppo o agire su servizi esterni senza una richiesta esplicita.

## 3. Ambito e autorizzazione

Segui l’istruzione dell’utente per l’attività corrente.

- Se la richiesta è chiara e circoscritta, procedi entro quel perimetro.
- Se richiede una scelta funzionale o architetturale non ancora concordata, presenta le alternative rilevanti e chiedi quale adottare prima di implementarla.
- Se durante il lavoro emerge un problema che richiede di ampliare l’ambito, fermati su quel punto e spiega la decisione necessaria.
- Un’autorizzazione riguarda solo l’attività concordata: non estenderla a refactoring, rinominazioni o funzionalità aggiuntive.

Prima di una modifica ampia o che coinvolge più moduli, riassumi obiettivo, approccio, componenti interessati e verifiche previste. Per interventi piccoli e già definiti, non ripetere un piano formale.

## 4. Codice e documentazione

Il codice mostra il comportamento attualmente implementato; le specifiche descrivono il comportamento concordato. Verifica entrambi e segnala le discrepanze.

Usa i documenti secondo il loro ambito:

- `AGENTS.md`: istruzioni di lavoro valide per tutto il repository;
- `specs.md` o documenti equivalenti: requisiti e contratti condivisi;
- specifiche di modulo: regole, dati e comportamenti propri di quel modulo;
- `plan.md`: attività, responsabilità, dipendenze e stato del lavoro.

Non duplicare nelle istruzioni globali i dettagli delle singole specifiche. Se due fonti sembrano in conflitto, non scegliere in silenzio: indica quali sono, qual è il conflitto e chiedi quale decisione rappresenta lo stato aggiornato.

Mantieni distinguibili:

- decisioni concordate;
- comportamenti verificati nel codice;
- proposte non ancora approvate;
- ipotesi da validare;
- questioni aperte.

Aggiorna la documentazione pertinente quando una modifica approvata cambia un comportamento, un contratto o una decisione.

## 5. Confini dei moduli e contratti

Ogni modulo è responsabile di acquisire o ricevere i propri dati, normalizzarli nel modello concordato e renderli disponibili attraverso l’interfaccia prevista.

Prima di cambiare un tipo, un endpoint o il formato di uno scambio, verifica chi lo produce e chi lo consuma. Considera almeno:

- campi obbligatori e facoltativi;
- valori nulli e informazioni mancanti;
- unità di misura, fuso orario e intervallo temporale;
- provenienza e momento di riferimento dei dati;
- errori e indisponibilità della fonte.

Non cambiare il contratto di un modulo per adattarlo a un altro senza analizzare l’impatto su entrambi e ottenere la decisione necessaria.

## 6. Dati, stime e simulazioni

Mantieni distinguibili dati osservati, importati, simulati, stimati e previsti. Non presentare una categoria come un’altra.

Quando tocchi dati o fonti, verifica e conserva, se disponibili:

- fonte e modalità di acquisizione;
- timestamp o periodo di riferimento;
- unità di misura e significato;
- trasformazioni applicate;
- limiti noti di copertura o affidabilità.

Non sostituire automaticamente un dato mancante con zero: zero deve avere un significato reale nel contesto. Non introdurre coefficienti o assunzioni numeriche senza renderli visibili e motivarli.

Gestisci i casi anomali in modo proporzionato al contesto e ai requisiti. Non aggiungere controlli, stati o meccanismi di recupero per scenari puramente teorici senza una necessità concreta; se un caso raro può compromettere l’integrità dei dati, segnala il rischio prima di introdurre complessità.

## 7. Decisioni tecniche e modifiche

Scegli soluzioni compatibili con l’architettura e il livello attuale del progetto. Per decisioni rilevanti, considera correttezza, semplicità, manutenibilità, affidabilità, privacy e possibilità di verifica.

Preferisci modifiche circoscritte. Non riscrivere codice funzionante, aggiungere dipendenze o creare astrazioni generiche senza un bisogno dimostrabile.

Non presumere che un refactoring sia richiesto solo perché la struttura potrebbe essere migliorata. Se il refactoring è necessario per completare la richiesta, spiegane il legame e mantienilo nel perimetro minimo utile.

## 8. Verifiche

Esegui le verifiche richieste dall’utente o necessarie per valutare correttamente una modifica, purché rientrino nel perimetro autorizzato.

Scegli controlli pertinenti al cambiamento, per esempio typecheck, test, build o verifica manuale del flusso interessato. Non eseguire test o comandi che modificano dati, installano dipendenze o cambiano lo stato del progetto senza autorizzazione.

Riporta con precisione:

- quali verifiche hai eseguito;
- quali sono riuscite o fallite;
- che cosa non è stato verificato.

Non dichiarare superata una verifica che non è stata eseguita.

## 9. Consegna del lavoro

Al termine, riassumi in modo conciso:

- che cosa è cambiato e perché;
- quali moduli o contratti sono stati coinvolti;
- quali verifiche sono state eseguite;
- eventuali decisioni ancora aperte o limiti rilevanti.

Mantieni la spiegazione utile a un membro del gruppo che non ha seguito ogni passaggio della conversazione.
