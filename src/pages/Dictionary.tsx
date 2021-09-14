import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonButton,
  IonItem,
  IonLabel,
  IonModal,
} from "@ionic/react";
import React, { RefObject, useEffect, useState } from "react";
import HanziWriter from "hanzi-writer";
import { search } from "chinese-lexicon";

import "./styles.css";

interface Component {
  type: string;
  char: string;
  fragment: number[];
  definition: string;
  pinyin: string;
  notes: string;
}

interface SimpEtymology {
  notes: string;
  definition: string;
  components: Component[];
  images: any[];
  pinyin: string;
}

interface TopWord {
  word: string;
  share: number;
  trad: string;
  gloss: string;
}

interface Statistics {
  hskLevel: number;
  movieWordCount: number;
  movieWordCountPercent: number;
  movieWordRank: number;
  movieWordContexts: number;
  movieWordContextsPercent: number;
  bookWordCount: number;
  bookWordCountPercent: number;
  bookWordRank: number;
  movieCharCount: number;
  movieCharCountPercent: number;
  movieCharRank: number;
  movieCharContexts: number;
  movieCharContextsPercent: number;
  bookCharCount: number;
  bookCharCountPercent: number;
  bookCharRank: number;
  topWords: TopWord[];
}

interface Simp {
  count: number;
}

interface Trad {
  count: number;
}

interface UsedAsComponentIn {
  simp: Simp;
  trad: Trad;
}

interface RootObject {
  simp: string;
  trad: string;
  definitions: string[];
  pinyin: string;
  searchablePinyin: string;
  pinyinTones: string;
  simpEtymology: SimpEtymology;
  statistics: Statistics;
  boost: number;
  usedAsComponentIn: UsedAsComponentIn;
  relevance: number;
}

const delayBetweenAnimations = 1000;

// Using the search function of the API
const searchFunction = async (word: string) => {
  const result = await search(word);
  return result;
};

// Here we use the hanziWriter to keep animating the character until is done and then a dealy of 1 sec.
const animateCharacter = (character: HanziWriter, delay = 1000) => {
  return new Promise((resolve, reject) => {
    character.animateCharacter({
      onComplete: () => {
        setTimeout(() => {
          resolve(character);
        }, delay);
      },
    });
  });
};

// Here we concat animations to render more than 1 character
const concatAnimations = async function (characters: HanziWriter[]) {
  for (let i = 0; i < characters.length; i++) {
    await animateCharacter(characters[i], delayBetweenAnimations);
  }
};

const Dictionary: React.FC = () => {
  // This state is for the searchbar
  const [searchText, setSearchText] = useState("");

  // This is an array made of all the words found
  const [searched, setSearched] = useState<RootObject[]>([]);

  // This tells the app if the modal is closed or not.
  const [showModal, setShowModal] = useState(false);

  // This is the word selected for the modal
  const [selectedWord, setSelectedWord] = useState("");

  // This is the group of words about to be rendered
  const [renderedCanvases, setRenderedCanvases] = useState<JSX.Element[]>([]);

  // This the group of references for the diferent canvases in order to gain better control for each of them.
  const [canvasesRef, setCanvasesRef] = useState<RefObject<HTMLDivElement>[]>(
    []
  );

  let [hanziWriters, setHanziWriters] = useState<HanziWriter[]>();

  // Definition Object
  const [wordObj, setWordObj] = useState<RootObject>();

  // Everything related to speed
  const [traceSpeed, setTraceSpeed] = useState<number>(1); // Default value
  const setSpeed = (symbol: string) => {
    if (traceSpeed < 5 && symbol === "+") {
      setTraceSpeed(traceSpeed + 1);
    }
    if (traceSpeed > 1 && symbol === "-") {
      setTraceSpeed(traceSpeed - 1);
    }
    hanziWriters &&
      (hanziWriters[0]._options.strokeAnimationSpeed = traceSpeed);
  };

  // Each time the selected word changes you the array of canvases is remade in order to be rendered in the new modal.
  useEffect(() => {
    const chineseCharactertsArray = selectedWord.split("");
    const newCanvases: JSX.Element[] = [];
    const newCanvasesRef: RefObject<HTMLDivElement>[] = [];
    chineseCharactertsArray.forEach((character, index) => {
      let canvasRef = React.createRef<HTMLDivElement>();
      newCanvases.push(<div className="hanzi" ref={canvasRef} key={index} />);
      newCanvasesRef.push(canvasRef);
    });
    if (canvasesRef !== newCanvasesRef) {
      setCanvasesRef(newCanvasesRef);
    }
    if (renderedCanvases !== newCanvases) {
      setRenderedCanvases(newCanvases);
    }
    // eslint-disable-next-line
  }, [selectedWord]);

  // Each time the rendered canvases array changes the hanzi writer starts to animate the writings
  // of each character one after one.
  useEffect(() => {
    let tempWritersArray: HanziWriter[] = [];
    const chineseCharactertsArray = selectedWord.split("");
    chineseCharactertsArray.forEach((character, index) => {
      if (canvasesRef[index]?.current) {
        tempWritersArray.push(
          HanziWriter.create(
            canvasesRef[index].current as HTMLElement,
            character,
            {
              width: 200,
              height: 200,
              padding: 5,
              showCharacter: false,
              strokeAnimationSpeed: traceSpeed,
              delayBetweenStrokes: 10, // milliseconds
              onLoadCharDataSuccess: () => {
                (canvasesRef[index].current as HTMLElement).addEventListener(
                  "click",
                  () => {
                    tempWritersArray[index].animateCharacter();
                  }
                );
              },
            }
          )
        );
      }
    });
    setHanziWriters(tempWritersArray);
    concatAnimations(tempWritersArray);

    // eslint-disable-next-line
  }, [renderedCanvases]);

  function renderDefinitions() {
    return (
      <div className="definition-container">
        {wordObj?.definitions.map((definition, index) => {
          return (
            <p key={index + 1} className="definition">
              {index + 1}. {definition}
            </p>
          );
        })}
      </div>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dictionary</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>Searchbar with cancel button shown on focus</p>
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value!)}
          showCancelButton="focus"
        ></IonSearchbar>
        <IonButton
          color="primary"
          onClick={async (event: React.MouseEvent<HTMLElement>) => {
            setSearched(await searchFunction(searchText));
          }}
        >
          Search
        </IonButton>
        <IonList>
          {searched.length > 0 ? (
            <>
              {searched.map((result, index) => (
                <IonItem
                  onClick={() => {
                    setSelectedWord(result.simp);
                    setShowModal(true);
                    setWordObj(result);
                  }}
                  key={index}
                >
                  <IonLabel>
                    {result.simp} {"->"} {result.definitions[0]}
                  </IonLabel>
                </IonItem>
              ))}
            </>
          ) : (
            <p>Not found anything</p>
          )}
        </IonList>

        {/* Writing character */}
        {showModal && (
          <IonModal
            isOpen
            onWillDismiss={() => {
              setShowModal(false);
            }}
          >
            <h1 className="ink-modal-title">{wordObj?.pinyin}</h1>
            <h2 className="definition-container">Definition:</h2>
            {renderDefinitions()}
            <div className="hanzi-container">{renderedCanvases}</div>
            <div>
              <IonButton
                onClick={() => {
                  setSpeed("-");
                }}
              >
                Slower
              </IonButton>
              <IonButton
                onClick={() => {
                  setSpeed("+");
                }}
              >
                Faster
              </IonButton>
            </div>

            <IonButton
              onClick={() => {
                setShowModal(false);
                setSelectedWord("");
              }}
            >
              Close Modal
            </IonButton>
          </IonModal>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Dictionary;
