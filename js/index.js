
///////////////////////////// LES VARIABLES DU QUIZ ///////
//////////////////////////////////////////////////////////

//Nombre de question justes ou  correctes
let nombreQuestionCorrect = 0;

//Numéro de la question courante
let noQuestionCourante = 0;

//LOL garder ça
let setActuel = questionSet1;



//==========SOURCE MÉDIA ET SON ==============///

let musiqueQuiz = new Audio ('Medias/musique-quiz.mp3');
let sonRessi = new Audio ('Medias/son-succes.mp3');
let sonEchec = new Audio ('Medias/son-echec.mp3');
//===========================================///


//---------------  SECTION BARRE D'AVANCEMENT --------
//Barre d'avancement quiz
let barreAvancement = document.querySelector('.barre-avancement');

// largeur de la barre d'avancement 
let largeurDeBarre = 0;

// cible du largeur pour la progression
let cibleBarre = 0;
//----------------------------------------------------




//-------------SECTION DES QUIZ ----------------//

//Page d'intro 
let pageIntro = document.querySelector(".page-intro");

//Où mettre le quiz
let placePourQuiz = document.querySelector(".quiz");

// Fin du quiz
let finQuiz = document.querySelector(".resultat");

//Section pour le quiz ????? ////////////////////
let sectioQuiz = document.querySelector("section");
let positionX = 100;

//Conteneurs pour la les titres et des choix
let titreQuestion = document.querySelector(".titre-questions");

//--------------------------------


//=========TIMER=====   NE MARCHE PAS//
// let timeLeft = 30;

// let elem = document.querySelector(".bouton-timer");
// let timerID = setInterval(countdown, 1000);
//==================//



//============ SAUVEGARDE DES DONNÉES LOCAL STORAGE ===========//
//===============================================//
let historique = recuperationHistorique();

function recuperationHistorique(){
    let chaineDeDonne = localStorage.getItem("les-scores-historiques");

    return JSON.parse(chaineDeDonne) || [];
}



//=========THÈME=====//
let themeJourNuit;
let caseTheme = document.querySelector("#id-check-box");
//===================//


//bouton commencer quiz
let boutonCommencer = document.querySelector(".section-commencer");

//Recommencer un autre set 
let boutonDeRestart = document.querySelector(".bouton-recommencer");

//CURSEUR PERSONNALISÉ PART 1
let curseur = document.querySelector(".curseur");

//bouton retour au menu principal
let boutonRetour = document.querySelector(".bouton-retour");





//////=============================//////
/////========= ÉVÉNEMENTS ========//////

//Ce qui se passe après animation du titre
boutonCommencer.addEventListener("click", commencerSet1);

//Ce qui se passe après on clique sur Recommencer
boutonDeRestart.addEventListener('click', recommencer);

//CURSEUR PERSONNALISÉ PART 2
document.addEventListener("mousemove", bougerCurseur);

//case thème nuit
caseTheme.addEventListener("click", changerTheme);





//////=============================//////
/////========= FONCTIONS ========//////
function changerTheme (event){
    //selecteur root
    let root = document.querySelector(":root");

    if (caseTheme.checked == true){
        // Test
        //console.log("Texte 1");
        root.style.setProperty("--couleur-fond", "#005c60");
        
    } else{
        //test
        //console.log("Texte 5");
        root.style.setProperty("--couleur-fond", "#008e96");
    }

}




//CommencerSet1
function commencerSet1(){
   //=======IMPORTANT LOCAL STORAGE ====//
   //AJOUTER LA DATE ACTUELLE ET LA RÉPONSE EN % //
   historique.push({ date: new Date().toLocaleDateString("fr-CA"), reponses: [] });
   
localStorage.setItem("les-scores-historiques", JSON.stringify(historique));
    //==================================//



   //enlève la page intro
    pageIntro.style.display = "none";
    
    //enlève l'ecouteur qui gere affichage du question
    boutonCommencer.removeEventListener("click", commencerSet1);

    //enlève le conteneur fin quiz pour l'instant ????
    finQuiz.style.display = "none";

    //scene quiz
    placePourQuiz.style.display = "flex";

    //PROCHAIN FONCTION
    afficherQuestions();
    
    //Joue la musique quiz
    musiqueQuiz.play();

    


    
}

//commencer le quiz
function afficherQuestions(){
    
    //ajouter l'écouteur du retour
    boutonRetour.addEventListener("click", retourAuDebut);
    

    //=======AJOUT DES QUESTIONS======//

    //Les questions dans la section questionnaire.js
    let lesQuestions = setActuel[noQuestionCourante];
    
    //Mettre le textes des questions
    titreQuestion.innerText = lesQuestions.titre;



    //=======AJOUT DES QUESTIONS JUSQU'À LA FIN======//
    let notreChoix;

    //ajouter les questions suite par suite
    for (let index = 0; index < lesQuestions.choix.length; index++){
        //création de la section et l'ajout des choix
        notreChoix = document.createElement("div");
    
        //Mettre dans ??
        notreChoix.innerText = lesQuestions.choix[index];

        //Affectation de chaque choix ??
        notreChoix.indexChoix = index;

        //Affichage
        titreQuestion.append(notreChoix);

        //VÉRIFICATION DES RÉPONSES PARTIE 1
        notreChoix.addEventListener("mousedown", verification);
    }


    //===== ANIMATION BARRE D'AVANCEMENT ====/

    //valeur de sa position
    positionX = 100;

    //la section RAF
    requestAnimationFrame(animerSectionBarre);

    //partir la plus difficile
    cibleBarre = (noQuestionCourante + 1) / questionSet1.length * 100;

    //Commencer l'animation de notre barre d'avancement
    requestAnimationFrame(animationBarre);

    //=======COMMENCER TIMER ========//
    // function countdown(){
    //     if (timeLeft == 0){
    //         mettreProchainsQuestion();
    //     } else {
    //         elem.innerHTML = timeLeft;
    //         timeLeft--;
    //     }
    // }

}

 //===== ANIMATION BARRE D'AVANCEMENT FONCTION 1 ====/
function animationBarre(){
    //augmentation du largeur
    largeurDeBarre += 1;

    //problem!!!!!!!!!!
    barreAvancement.style.width = largeurDeBarre + "vw";

    //Partie largeur cible
    if(largeurDeBarre < cibleBarre){
        requestAnimationFrame(animationBarre);
    }

}

//===== ANIMATION BARRE D'AVANCEMENT FONCTION 2 ====/
function animerSectionBarre(){
    positionX -= 1;
    sectioQuiz.style.transform = `translateX(${positionX})`;

    if (positionX > 0){
        requestAnimationFrame(animerSectionBarre);
    }

}

//VERIFICATION DES REPONSES PAR L'UTILISATEUR
function verification (event){
    
    // !!!! LOCAL STORAGE //
    //====================//
    historique[historique.length - 1].reponses.push(event.target.indexChoix)

    localStorage.setItem("les-scores-historiques", JSON.stringify(historique));

    //===========================//



    let choixFinal = event.target;

    if (choixFinal.indexChoix == questionSet1[noQuestionCourante].reponse){
        choixFinal.classList.add('succes');
        // console.log("CORRECT " + nombreQuestionCorrect);
        nombreQuestionCorrect += 1;
        sonRessi.play();
    }
    else{
        choixFinal.classList.add('echec');
        // console.log("WRONG" + nombreQuestionCorrect);
        sonEchec.play();
    }

    choixFinal.addEventListener('animationend', mettreProchainsQuestion);

}

//METTRE LES PROCHAINS QUESTIONS
function mettreProchainsQuestion (event){

    //l'ajout des nombre de question courante pour passer a la prochaine question
    noQuestionCourante++;

    //Est-ce qu'il reste encore des questions?
    if (noQuestionCourante < questionSet1.length){
        afficherQuestions();
    } else{
        afficherResultat();
    }
}

//AFFICHAGE DU RESULTAT
    function afficherResultat(){
        //enleve le quiz
        placePourQuiz.style.display = "none";
        
        // ============SECTION LOCAL STORAGE ========//
        //=========Il faut montrer les scores en % =======//
        historique = recuperationHistorique();

        //savoir les parties jouées
        let lesPartiesJouées = historique.length;

        let scoreResultat = document.createElement('section');
    
        //AFFICHAGE DES LOCAL STORAGE ET RÉPONSES
        scoreResultat.innerHTML = `<p>VOUS AVEZ JOUÉ ${lesPartiesJouées} PARTIES</p>`;
        scoreResultat.innerHTML += `<p> VOTRE RÉPONSE: ${nombreQuestionCorrect + " / 10" + "\n" + ((nombreQuestionCorrect/10)*100)+"%"}</p>`;
    for (let partie of historique) {
        scoreResultat.innerHTML += ` Histoire: ${partie.date} <br>`;
    }

        //animation
        scoreResultat.classList.add("animationResultat");

        //append et insertion
        finQuiz.append(scoreResultat);

        //Fin quiz display 
        finQuiz.style.display = "flex";

        //Si on veut recommencer
        boutonDeRestart.addEventListener('click', recommencer);
       

       

        
    }

//SI ON CLIQUE SUR RETOUR, ON RETOURNE AU DEBUT DU QUIZ
function retourAuDebut(){
    //Reset des variables
    noQuestionCourante = 0;
    nombreQuestionCorrect = 0;
    largeurDeBarre = 0; 
    cibleBarre = 0; 

    //Test
    //console.log("TEST POUR SAVOIR S'IL A MARCHÉ " + ((345+234)-34) * 10);

    //enleve le conteneur du quiz???
    placePourQuiz.style.display = "none";
    
    //afficher la page principal?????
    pageIntro.style.display = "flex";

    //restart
    boutonCommencer.addEventListener("click", commencerSet1);

    //Pas de musique
    musiqueQuiz.pause();


}

//RECOMMENCER LES QUESTIONS
function recommencer(){
   console.log("Test pour verification rapide");

   //Reset des variables
   noQuestionCourante = 0;
   nombreQuestionCorrect = 0;
   largeurDeBarre = 0; 
   cibleBarre = 0; 

   //enlve la page intro
    pageIntro.style.display = "none";
    
    //enlève l'ecouteur qui gère affichage du question
    boutonDeRestart.removeEventListener('click', recommencer);

    //enlève le conteneur fin quiz
    finQuiz.style.display = "none";

    //scène quiz
    placePourQuiz.style.display = "flex";

    //PROCHAIN FONCTION
    afficherQuestions();
}

/*FONCTION POUR LE CURSEUR (PART 3)*/
function bougerCurseur(event){
    //Test dans Console en premier
    //console.log("client X, Y : ", event.clientX, event.clientY );

    //suivre le curseur
    curseur.style.translate = event.clientX + 'px ' + event.clientY + 'px'; 
    

    //Window matchMedia 
    if (window.matchMedia("(hover: hover)").matches){
        document.querySelector(".curseur").style.display = "none";
    } else {
        document.querySelector(".curseur").style.display = "auto";
    }
}