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
} from "@ionic/react";
import React, { useState } from "react";

import translate from "google-translate-open-api";

const searchFunction = async (word: string) => {
  const result = await translate(word, {
    tld: "cn",
    to: "zh-CN",
  });
  const data = result.data;
  return data;
};

const Dictionary: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searched, setSearched] = useState<string[]>([]);
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
                <IonItem key={index}>
                  <IonLabel>{result}</IonLabel>
                </IonItem>
              ))}
            </>
          ) : (
            <p>Not found anything</p>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Dictionary;
