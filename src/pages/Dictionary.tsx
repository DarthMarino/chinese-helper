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
import React, { useEffect, useRef, useState } from "react";
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

const searchFunction = async (word: string) => {
  const result = await search(word);
  return result;
};

const Dictionary: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searched, setSearched] = useState<RootObject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const canvas1 = useRef<HTMLDivElement>(null);
  const canvas2 = useRef<HTMLDivElement>(null);
  const canvas3 = useRef<HTMLDivElement>(null);
  const canvas4 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wordsArray = selectedWord.split("");
    let writersArray: HanziWriter[] = [];
    const delayBetweenAnimations = 1000;
    if (canvas1.current) {
      const writer = HanziWriter.create(
        canvas1.current as HTMLElement,
        wordsArray[0],
        {
          width: 200,
          height: 200,
          padding: 5,
          showCharacter: false,
        }
      );
      writersArray.push(writer);
    }
    if (canvas2.current && wordsArray.length > 1) {
      const writer = HanziWriter.create(
        canvas2.current as HTMLElement,
        wordsArray[1],
        {
          width: 200,
          height: 200,
          padding: 5,
          showCharacter: false,
        }
      );
      writersArray.push(writer);
    }
    if (canvas3.current && wordsArray.length > 2) {
      const writer = HanziWriter.create(
        canvas3.current as HTMLElement,
        wordsArray[2],
        {
          width: 200,
          height: 200,
          padding: 5,
          showCharacter: false,
        }
      );
      writersArray.push(writer);
    }
    if (canvas4.current && wordsArray.length > 3) {
      const writer = HanziWriter.create(
        canvas4.current as HTMLElement,
        wordsArray[3],
        {
          width: 200,
          height: 200,
          padding: 5,
          showCharacter: false,
        }
      );
      writersArray.push(writer);
    }
    const concatAnimations = (theArray: HanziWriter[]) => {
      setTimeout(function () {
        if (theArray.length > 0) {
          theArray[0].animateCharacter({
            onComplete: () => {
              setTimeout(function () {
                if (theArray.length > 1) {
                  theArray[1].animateCharacter({
                    onComplete: () => {
                      setTimeout(function () {
                        if (theArray.length > 2) {
                          theArray[2].animateCharacter({
                            onComplete: () => {
                              setTimeout(function () {
                                if (theArray.length > 3) {
                                  theArray[3].animateCharacter();
                                }
                              }, delayBetweenAnimations);
                            },
                          });
                        }
                      }, delayBetweenAnimations);
                    },
                  });
                }
              }, delayBetweenAnimations);
            },
          });
        }
      }, delayBetweenAnimations);
    };
    concatAnimations(writersArray);
  }, [selectedWord, canvas1, canvas2, canvas3, canvas4]);

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
          <div className="hanzi-container">
            <div ref={canvas1} />
            <div ref={canvas2} />
            <div ref={canvas3} />
            <div ref={canvas4} />
          </div>
          <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Dictionary;
