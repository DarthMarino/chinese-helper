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
  console.log(result[0]);
  return result;
};

const Dictionary: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searched, setSearched] = useState<RootObject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const canvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvas.current) {
      const writer = HanziWriter.create(
        canvas.current as HTMLElement,
        selectedWord,
        {
          width: 300,
          height: 300,
          padding: 5,
        }
      );
      writer.animateCharacter();
    }
  }, [selectedWord, canvas]);

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
        <IonModal isOpen={showModal}>
          <p>The word selected is {selectedWord}</p>
          <div ref={canvas} />
          <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Dictionary;
