import { IonContent, IonPage } from "@ionic/react";
import React from "react";
const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="background" />
        <h1 className="ink-title">Chinese Helper</h1>
        <div>
          <img
            className="home-img"
            src="./assets/art/flowers.jpg"
            alt="Cool Artwork"
            width="100%"
            height="400px"
          />
          <p className="home-p">
            {" "}
            <b>
              This application was made in order to help others like me in
              learning how to write hanzi/chinese characters, by learning the
              paths. <br />
              <br /> You can either use the search bar on the middle tab or the
              user tab on the right side to access profile information an also
              your favorite words.
            </b>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
