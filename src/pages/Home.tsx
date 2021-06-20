import {
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonPage,
} from "@ionic/react";
import React from "react";
const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1 className="ink-title">Chinese Helper</h1>
        <IonCard>
          <IonItem>
            <img src="./assets/art/flowers.jpg" alt="Cool Artwork" />
          </IonItem>

          <IonCardContent>
            This application was made in order to help others like me in
            learning how to write hanzi/chinese characters, by learning the
            paths.
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
