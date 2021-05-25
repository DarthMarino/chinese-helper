import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonButton,
} from "@ionic/react";
import React, { useState } from "react";

import translate from "google-translate-open-api";

const searchFunction = async (word: string) => {
  const result = await translate(word, {
    tld: "cn",
    to: "zh-CN",
  });
  const data = result.data[0];
  return data;
};

const Dictionary: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  let searchResults: string[] = [];
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
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            searchFunction(searchText);
          }}
        >
          Search
        </IonButton>
        <IonList>
          {searchResults.length > 0 ? (
            <>
              {console.log(searchResults)}
              <p>Found something</p>
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
