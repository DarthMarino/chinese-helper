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

const searchFunction = async (word: string) => {
  const result = await search(word);
  return result;
};

const animateChatacter = (character: HanziWriter, delay = 1000) => {
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

const concatAnimations = async function (characters: HanziWriter[]) {
  for (let i = 0; i < characters.length; i++) {
    await animateChatacter(characters[i], delayBetweenAnimations);
  }
};

const Dictionary: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searched, setSearched] = useState<RootObject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const [renderedCanvases, setRenderedCanvases] = useState<JSX.Element[]>([]);
  const [canvasesRef, setCanvasesRef] = useState<RefObject<HTMLDivElement>[]>(
    []
  );

  useEffect(() => {
    const chineseCharactertsArray = selectedWord.split("");
    const newCanvases: JSX.Element[] = [];
    const newCanvasesRef: RefObject<HTMLDivElement>[] = [];
    chineseCharactertsArray.forEach((character, index) => {
      let canvasRef = React.createRef<HTMLDivElement>();
      newCanvases.push(<div ref={canvasRef} key={index} />);
      newCanvasesRef.push(canvasRef);
    });
    setCanvasesRef(newCanvasesRef);
    setRenderedCanvases(newCanvases);
  }, [selectedWord]);

  useEffect(() => {
    let writersArray: HanziWriter[] = [];
    const chineseCharactertsArray = selectedWord.split("");
    chineseCharactertsArray.forEach((character, index) => {
      if (canvasesRef[index]?.current) {
        writersArray.push(
          HanziWriter.create(
            canvasesRef[index].current as HTMLElement,

            character,
            {
              width: 200,
              height: 200,
              padding: 5,
              showCharacter: false,
              strokeAnimationSpeed: 5, // 5x normal speed
              delayBetweenStrokes: 10, // milliseconds
            }
          )
        );
      }
    });
    concatAnimations(writersArray);
    // eslint-disable-next-line
  }, [renderedCanvases]);
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
        <IonModal isOpen={showModal}>
          <p>How to write</p>
          <div className="hanzi-container">{renderedCanvases}</div>
          <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Dictionary;
