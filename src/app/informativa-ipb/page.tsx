'use client';

import React, { useState } from 'react';
import styles from './InformativaIPB.module.css';

const InformativaIPB: React.FC = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [terminiOpen, setTerminiOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/assets/SVG/logo-b.svg" 
          alt="Italian Prompt Battle" 
          className={styles.logo}
        />
      </div>
      <div className={styles.content}>
        <h1 className={styles.mainTitle}>
          Informativa privacy e termini di tartecipazione
        </h1>
        <div className={styles.introText}>
          <p>
            Ai sensi del Regolamento (UE) 2016/679 (GDPR) e della normativa italiana in materia di protezione dei dati personali (D.lgs. 196/2003 e s.m.i.), informiamo tutti gli utenti che si registrano o partecipano all&apos;Italian Prompt Battle che i loro dati personali saranno trattati in modo lecito, corretto e trasparente dai titolari Lucia Cenetiempo e Massimiliano Di Blasi, nel rispetto dei principi di tutela previsti dalla legge.
          </p>
          <p>
            La partecipazione all&apos;evento comporta inoltre l&apos;accettazione dei Termini e Condizioni di Partecipazione, che definiscono le regole di gara, l&apos;utilizzo dei materiali prodotti (immagini, prompt, video), le norme di condotta, le responsabilità e le modalità di comunicazione.
          </p>
        </div>

        <div className={styles.accordionContainer}>
          {/* Accordion Informativa Privacy */}
          <div className={styles.accordion}>
            <button
              className={`${styles.accordionHeader} ${privacyOpen ? styles.open : ''}`}
              onClick={() => setPrivacyOpen(!privacyOpen)}
              aria-expanded={privacyOpen}
            >
              <span className={styles.accordionTitle}>INFORMATIVA SUL TRATTAMENTO DEI DATI PERSONALI</span>
              <span className={styles.accordionIcon}>{privacyOpen ? '−' : '+'}</span>
            </button>
            {privacyOpen && (
              <div className={styles.accordionContent}>
                <PrivacyContent />
              </div>
            )}
          </div>

          {/* Accordion Termini e Condizioni */}
          <div className={styles.accordion}>
            <button
              className={`${styles.accordionHeader} ${terminiOpen ? styles.open : ''}`}
              onClick={() => setTerminiOpen(!terminiOpen)}
              aria-expanded={terminiOpen}
            >
              <span className={styles.accordionTitle}>TERMINI E CONDIZIONI DI PARTECIPAZIONE</span>
              <span className={styles.accordionIcon}>{terminiOpen ? '−' : '+'}</span>
            </button>
            {terminiOpen && (
              <div className={styles.accordionContent}>
                <TerminiContent />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente per il contenuto dell'Informativa Privacy
const PrivacyContent: React.FC = () => {
  return (
    <div className={styles.markdownContent}>
      <p className={styles.subtitle}>
        <strong>(ai sensi dell&apos;art. 13 del Regolamento UE 2016/679 – &quot;GDPR&quot; e del D.lgs. 196/2003 come modificato dal D.lgs. 101/2018)</strong>
      </p>

      <h2>1. TITOLARI DEL TRATTAMENTO</h2>
      <p>
        I dati personali forniti in occasione della registrazione e partecipazione all&apos;evento <em>Italian Prompt Battle</em> (di seguito &quot;Evento&quot;) saranno trattati in modo lecito, corretto e trasparente dai seguenti titolari autonomi del trattamento:
      </p>
      <ul>
        <li><strong>Lucia Cenetiempo</strong>, P.IVA IT13959710966, con sede legale in Via Pasquale Paoli 3, 20143 Milano (MI)</li>
        <li><strong>Massimiliano Di Blasi</strong>, P.IVA IT13950590961, con sede legale in Via Giovanni Paisiello 49, 20900 Monza (MB)</li>
      </ul>
      <p>
        I Titolari operano come <strong>titolari autonomi distinti</strong> e collaborano per la gestione organizzativa e promozionale dell&apos;Evento. I flussi di dati tra i Titolari avvengono nel rispetto del principio di minimizzazione e trasparenza.
      </p>
      <p>
        Per ogni comunicazione o esercizio dei diritti previsti dagli artt. 15-22 GDPR è possibile contattare:
        <br />
        📧 <strong>info@italianpromptbattle.com</strong>
      </p>
      <p>
        Inoltre, <strong>Talent Garden S.p.A.</strong>, con sede legale in Via Arcivescovo Calabiana 6, 20139 Milano (MI), agisce come <strong>titolare autonomo</strong> per i trattamenti effettuati in relazione alle proprie finalità promozionali e commerciali. Per tali attività, previo consenso espresso, i Titolari comunicheranno a TAG i seguenti dati: nome, cognome ed email. L&apos;informativa di TAG è disponibile al link:{' '}
        <a href="https://knowledge.talentgarden.com/it/kb/privacy-policy" target="_blank" rel="noopener noreferrer">https://knowledge.talentgarden.com/it/kb/privacy-policy</a>.
      </p>

      <h2>2. FINALITÀ DEL TRATTAMENTO E BASI GIURIDICHE</h2>
      <p>I dati personali saranno raccolti e trattati per le seguenti finalità:</p>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>N.</th>
              <th>Finalità del trattamento</th>
              <th>Base giuridica</th>
              <th>Tipologia di dati</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Gestione della registrazione, partecipazione e organizzazione dell&apos;Evento</td>
              <td>Esecuzione di un contratto o misure precontrattuali (art. 6.1.b GDPR)</td>
              <td>Nome, cognome, email, portfolio</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Comunicazioni operative (email di conferma, aggiornamenti, logistica, eventuali modifiche o cancellazioni)</td>
              <td>Esecuzione del contratto (art. 6.1.b GDPR)</td>
              <td>Nome, cognome, email</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Selezione dei partecipanti alle fasi preliminari e comunicazione dei risultati</td>
              <td>Interesse legittimo dei Titolari (art. 6.1.f GDPR) – bilanciamento effettuato positivamente; è sempre possibile opporsi (art. 21 GDPR)</td>
              <td>Dati anagrafici e professionali</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Realizzazione e diffusione di foto, video, registrazioni e immagini generate durante l&apos;Evento</td>
              <td>Consenso esplicito dell&apos;interessato (art. 6.1.a GDPR) per usi promozionali; legittimo interesse per documentazione e cronaca (art. 6.1.f GDPR)</td>
              <td>Immagini, video, voce, opere AI generate</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Invio di newsletter e comunicazioni promozionali relative a eventi futuri e progetti di Lucia Cenetiempo, Massimiliano Di Blasi e Talent Garden S.p.A.</td>
              <td>Consenso esplicito dell&apos;interessato (art. 6.1.a GDPR)</td>
              <td>Nome, cognome, email</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Adempimenti legali, amministrativi e fiscali</td>
              <td>Obbligo legale (art. 6.1.c GDPR)</td>
              <td>Dati identificativi e contabili</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. MODALITÀ DEL TRATTAMENTO</h2>
      <p>
        Il trattamento avverrà mediante strumenti informatici, telematici e cartacei, nel rispetto dei principi di liceità, correttezza, trasparenza, minimizzazione e integrità.
      </p>
      <p>Sono adottate misure di sicurezza tecniche e organizzative adeguate, tra cui:</p>
      <ul>
        <li>autenticazione a due fattori e password cifrate;</li>
        <li>cifratura dei dati in transito e a riposo;</li>
        <li>backup periodici e hardening dei sistemi;</li>
        <li>accesso riservato ai soli soggetti autorizzati;</li>
        <li>registrazione e gestione di eventuali incidenti di sicurezza;</li>
        <li>formazione continua del personale.</li>
      </ul>
      <p>Non sono previsti processi decisionali automatizzati né attività di profilazione.</p>

      <h2>4. LUOGO DEL TRATTAMENTO E TRASFERIMENTO DEI DATI</h2>
      <p>I dati sono archiviati e trattati mediante:</p>
      <ul>
        <li><strong>MailerLite</strong> (server localizzati nell&apos;Unione Europea – Germania e Paesi Bassi – conformità GDPR dichiarata);</li>
        <li><strong>Eventbrite</strong> (server localizzati nell&apos;Unione Europea e negli Stati Uniti). Eventbrite applica le <strong>Clausole Contrattuali Standard (SCC)</strong> approvate dalla Commissione Europea per il trasferimento dei dati extra UE ai sensi dell&apos;art. 46 GDPR e misure supplementari tecniche e organizzative.</li>
      </ul>
      <p>
        Eventuali ulteriori trasferimenti verso Paesi terzi avverranno solo qualora il Paese garantisca un livello di protezione adeguato o siano adottate garanzie adeguate ai sensi degli artt. 45 e 46 GDPR. Gli interessati possono richiedere copia delle garanzie applicate.
      </p>

      <h2>5. PERIODO DI CONSERVAZIONE DEI DATI</h2>
      <ul>
        <li><strong>Dati di iscrizione</strong>: conservati per 24 mesi dalla raccolta, salvo rinnovo del consenso o necessità amministrative.</li>
        <li><strong>Dati foto/video e immagini generate</strong>: riesaminati ogni 36 mesi per verificarne l&apos;attualità rispetto alle finalità originarie; in assenza di necessità saranno cancellati o anonimizzati.</li>
        <li><strong>Dati utilizzati per finalità di marketing</strong>: conservati fino a revoca del consenso o per un massimo di 24 mesi dall&apos;ultimo contatto utile.</li>
      </ul>

      <h2>6. DESTINATARI E COMUNICAZIONE DEI DATI</h2>
      <p>I dati potranno essere comunicati a:</p>
      <ul>
        <li>fornitori tecnici e gestori di piattaforme digitali (MailerLite, Eventbrite);</li>
        <li>personale autorizzato dei Titolari e di Talent Garden S.p.A.;</li>
        <li>partner media e soggetti coinvolti nell&apos;organizzazione e comunicazione dell&apos;Evento;</li>
        <li>consulenti o professionisti esterni per adempimenti legali, contabili e fiscali.</li>
      </ul>
      <p>
        Tutti i soggetti che tratteranno i dati agiranno in qualità di <strong>Responsabili del trattamento</strong> ex art. 28 GDPR o <strong>Autorizzati</strong> ex art. 29 GDPR.
      </p>
      <p>
        I dati non saranno diffusi, ad eccezione di foto e video pubblicati su canali social, siti web o materiali promozionali, nel rispetto del consenso fornito.
      </p>
      <p>Un elenco aggiornato delle categorie di Responsabili è disponibile su richiesta e pubblicato sul sito web dell&apos;Evento.</p>

      <h2>7. DIRITTI DELL&apos;INTERESSATO</h2>
      <p>In conformità con gli artt. 15-22 del GDPR, l&apos;interessato ha diritto di:</p>
      <ul>
        <li>ottenere conferma dell&apos;esistenza dei propri dati e accedervi;</li>
        <li>richiedere la rettifica o aggiornamento;</li>
        <li>chiedere la cancellazione dei dati (diritto all&apos;oblio);</li>
        <li>ottenere la limitazione del trattamento;</li>
        <li>opporsi per motivi legittimi;</li>
        <li>revocare il consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento precedente;</li>
        <li>richiedere la portabilità dei dati.</li>
      </ul>
      <p>
        Le richieste vanno inviate a <strong>info@italianpromptbattle.com</strong>. I Titolari risponderanno entro <strong>30 giorni</strong> (prorogabili a 60 per richieste complesse), previa verifica dell&apos;identità. L&apos;esercizio dei diritti è gratuito, salvo richieste manifestamente infondate o ripetitive.
      </p>
      <p>
        È sempre possibile proporre reclamo all&apos;<strong>Autorità Garante per la Protezione dei Dati Personali</strong> (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a>).
      </p>

      <h2>8. OBBLIGATORIETÀ DEL CONFERIMENTO DEI DATI E LIMITAZIONI</h2>
      <p>
        Il conferimento dei dati contrassegnati come obbligatori nel modulo di registrazione è necessario per la partecipazione all&apos;Evento. Il mancato conferimento comporterà l&apos;impossibilità di completare l&apos;iscrizione.
      </p>
      <p>Il conferimento dei dati per finalità promozionali e di marketing è facoltativo.</p>
      <p>
        La partecipazione è riservata a <strong>maggiorenni</strong>. Si invita a non inviare dati di terzi o <strong>categorie particolari di dati personali</strong> (art. 9 GDPR). Eventuali dati eccedenti saranno cancellati senza conservazione.
      </p>

      <h2>9. COOKIE E STRUMENTI DI ANALYTICS</h2>
      <p>
        Il sito web utilizza cookie tecnici e, previo consenso, cookie di profilazione e strumenti di analisi statistica. Per maggiori informazioni, consultare la <strong>Cookie Policy</strong> disponibile su www.italianpromptbattle.com.
      </p>

      <h2>10. AGGIORNAMENTI E VERSIONI DELL&apos;INFORMATIVA</h2>
      <p>
        La presente informativa potrà essere aggiornata o modificata per conformarsi a mutamenti normativi o organizzativi.
      </p>
      <p>
        La versione più recente e la cronologia delle revisioni saranno sempre disponibili sul sito ufficiale <strong>www.italianpromptbattle.com</strong>.
      </p>
      <p><strong>Ultimo aggiornamento: Novembre 2025.</strong></p>
    </div>
  );
};

// Componente per il contenuto dei Termini e Condizioni
const TerminiContent: React.FC = () => {
  return (
    <div className={styles.markdownContent}>
      <h2>1. OGGETTO</h2>
      <p>
        Il presente documento disciplina i termini e le condizioni di partecipazione all&apos;evento <strong>Italian Prompt Battle</strong> (di seguito, &quot;Evento&quot;), competizione creativa e artistica basata sulla generazione di immagini mediante strumenti di intelligenza artificiale.
      </p>
      <p><strong>Organizzatori:</strong></p>
      <ul>
        <li><strong>Lucia Cenetiempo</strong>, P.IVA IT13959710966, con sede legale in Via Pasquale Paoli 3, 20143 Milano (MI)</li>
        <li><strong>Massimiliano Di Blasi</strong>, P.IVA IT13950590961, con sede legale in Via Giovanni Paisiello 49, 20900 Monza (MB)</li>
      </ul>
      <p>
        Partner: <strong>Talent Garden S.p.A.</strong>, Via Arcivescovo Calabiana 6, 20139 Milano (MI).
      </p>
      <p>
        L&apos;iscrizione all&apos;Evento implica l&apos;accettazione integrale dei presenti Termini e Condizioni e della <strong>Informativa Privacy</strong> disponibile su{' '}
        <a href="https://www.italianpromptbattle.com" target="_blank" rel="noopener noreferrer">www.italianpromptbattle.com</a>.
      </p>

      <h2>2. REQUISITI DI PARTECIPAZIONE</h2>
      <p>
        La partecipazione è <strong>gratuita</strong> e riservata a persone fisiche <strong>maggiorenni</strong>. L&apos;iscrizione avviene tramite:
      </p>
      <ul>
        <li>il sito ufficiale <a href="https://www.italianpromptbattle.com" target="_blank" rel="noopener noreferrer">www.italianpromptbattle.com</a>, oppure</li>
        <li>la piattaforma <strong>Eventbrite</strong>.</li>
      </ul>
      <p>
        I partecipanti devono fornire dati veritieri e aggiornati. È vietato fornire informazioni false o incomplete. Gli organizzatori si riservano di escludere chiunque violi le regole di condotta o presenti comportamenti contrari all&apos;etica dell&apos;Evento.
      </p>
      <p>
        La partecipazione comporta l&apos;obbligo di rispettare i regolamenti interni della sede ospitante (Talent Garden S.p.A.), comprese norme di sicurezza e condotta.
      </p>

      <h2>3. REGOLAMENTO TECNICO</h2>
      <p>
        Le modalità di gara, i criteri di selezione, di valutazione e di squalifica sono contenuti nel <strong>Regolamento Tecnico</strong> pubblicato sul sito ufficiale. In caso di contrasto prevalgono i presenti Termini e il Regolamento Tecnico. Gli organizzatori possono modificare il Regolamento per esigenze tecniche, dandone comunicazione tempestiva.
      </p>

      <h2>4. SVOLGIMENTO DELL&apos;EVENTO</h2>
      <p>
        L&apos;Evento prevede sfide creative tra partecipanti che generano immagini a partire da testi (&quot;prompt&quot;) utilizzando software di intelligenza artificiale generativa. Gli organizzatori potranno modificare la struttura o la durata dell&apos;Evento per ragioni tecniche o di sicurezza, senza che ciò comporti diritto ad alcun indennizzo.
      </p>

      <h2>5. PROPRIETÀ INTELLETTUALE E LICENZA D&apos;USO</h2>
      <p>I partecipanti mantengono la <strong>titolarità dei diritti d&apos;autore</strong> sulle opere e sui prompt generati.</p>
      <p>
        Con la partecipazione, l&apos;autore concede agli organizzatori una <strong>licenza non esclusiva, gratuita, perpetua, irrevocabile, trasferibile e sublicenziabile</strong> per l&apos;utilizzo, pubblicazione, riproduzione, comunicazione al pubblico e diffusione delle opere realizzate durante l&apos;Evento, per finalità di promozione, comunicazione e archiviazione storica dell&apos;Evento e delle sue edizioni future. Resta salvo il diritto morale dell&apos;autore alla paternità dell&apos;opera.
      </p>
      <p>
        L&apos;autore garantisce che le opere non violano diritti di terzi, né contengono dati personali o materiali protetti senza base giuridica. In caso di contestazioni, l&apos;autore manleva integralmente gli organizzatori e i partner.
      </p>
      <p>
        I prompt utilizzati resteranno archiviati per finalità di verifica e trasparenza; potranno essere mostrati durante o dopo l&apos;Evento in forma non riutilizzabile, senza pubblicazione integrale salvo consenso espresso.
      </p>

      <h2>6. FOTO, VIDEO E RIPRESE DELL&apos;EVENTO</h2>
      <p>
        Durante l&apos;Evento potranno essere effettuate riprese fotografiche, video e audio da parte degli organizzatori e dei partner media.
      </p>
      <p>
        La partecipazione comporta il consenso all&apos;uso dell&apos;immagine e della voce del partecipante per finalità di documentazione, comunicazione e promozione.
      </p>
      <p>
        Le riprese a fini di cronaca/documentazione si basano sul <strong>legittimo interesse</strong> degli organizzatori (art. 6.1.f GDPR), mentre per fini promozionali è richiesto <strong>consenso esplicito</strong> al momento della registrazione.
      </p>
      <p>
        Le aree soggette a riprese saranno segnalate. I partecipanti possono richiedere la rimozione o oscuramento della propria immagine scrivendo a <strong>info@italianpromptbattle.com</strong>.
      </p>

      <h2>7. CONDOTTA, SICUREZZA E OGGETTI VIETATI</h2>
      <p>È vietato:</p>
      <ul>
        <li>generare contenuti illegali, diffamatori, discriminatori, violenti o osceni;</li>
        <li>introdurre sostanze illecite, oggetti pericolosi o materiali non autorizzati;</li>
        <li>assumere comportamenti offensivi o che mettano in pericolo sé o altri.</li>
      </ul>
      <p>
        Lo staff potrà effettuare controlli all&apos;ingresso. L&apos;organizzazione può negare l&apos;accesso o allontanare partecipanti che violino tali regole, senza obbligo di rimborso.
      </p>
      <p>
        Per esigenze di accessibilità o accomodamenti ragionevoli scrivere a <strong>info@italianpromptbattle.com</strong> con congruo anticipo.
      </p>

      <h2>8. RESPONSABILITÀ E LIBERATORIA</h2>
      <p>Gli organizzatori non rispondono di:</p>
      <ul>
        <li>interruzioni, rinvii o annullamenti dovuti a cause di forza maggiore, guasti tecnici o ordini dell&apos;autorità;</li>
        <li>danni diretti o indiretti subiti dai partecipanti in relazione alla partecipazione;</li>
        <li>utilizzo improprio dei contenuti generati dai partecipanti;</li>
        <li>perdita o danneggiamento di dispositivi personali o dati informatici.</li>
      </ul>
      <p>
        La connessione internet fornita è &quot;as is&quot;, senza garanzie di continuità. Ogni partecipante è responsabile dei propri dispositivi e dati.
      </p>
      <p>
        In caso di contestazione di contenuti, gli organizzatori potranno rimuoverli cautelativamente e richiedere chiarimenti all&apos;autore. È prevista una procedura di <strong>notice &amp; takedown</strong> con esame entro 10 giorni lavorativi.
      </p>

      <h2>9. MARKETING E COMUNICAZIONI</h2>
      <p>
        L&apos;invio di comunicazioni promozionali avviene solo previo <strong>consenso espresso</strong> fornito in sede di registrazione e revocabile in qualsiasi momento. I partecipanti potranno ricevere comunicazioni da Lucia Cenetiempo, Massimiliano Di Blasi e Talent Garden S.p.A., ciascuno in qualità di titolare autonomo.
      </p>

      <h2>10. FORZA MAGGIORE E VARIAZIONI</h2>
      <p>
        Eventuali rinvii, spostamenti o rimodulazioni dell&apos;Evento dovuti a cause non imputabili agli organizzatori non danno diritto ad alcun indennizzo. Gli organizzatori si impegnano a informare tempestivamente i partecipanti di ogni modifica rilevante tramite sito o email.
      </p>

      <h2>11. LEGGE APPLICABILE, FORO E LINGUA</h2>
      <p>
        Le presenti condizioni sono regolate dalla <strong>legge italiana</strong>. Per qualsiasi controversia è competente in via esclusiva il <strong>Foro di Milano</strong>. In caso di traduzioni, fa fede la <strong>versione in lingua italiana</strong>.
      </p>

      <h2>12. INTERO ACCORDO, SEPARABILITÀ E CESSIONE</h2>
      <p>
        Le presenti condizioni costituiscono l&apos;intero accordo tra le parti. L&apos;eventuale nullità di una clausola non inficia la validità delle restanti. È vietata la cessione del contratto senza consenso scritto degli organizzatori.
      </p>
      <p>
        Aggiornamenti sostanziali saranno comunicati con preavviso ragionevole via sito o email. Le modifiche non incidono sulle attività già svolte.
      </p>
      <p><strong>Ultimo aggiornamento: Novembre 2025.</strong></p>
    </div>
  );
};

export default InformativaIPB;

