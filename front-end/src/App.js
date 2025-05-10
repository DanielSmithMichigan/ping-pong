import React, { Component, useEffect, useState } from 'react';
import _ from 'lodash';
import Homepage from './Homepage';
import Homepage2 from './Homepage2';
import Match from './Match';
import Match2 from './Match2';

function App(props) {
  const [firstSelectedPlayer, setFirstSelectedPlayer] = useState(null);
  const [secondSelectedPlayer, setSecondSelectedPlayer] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  return (
    selectedPage === "match" ? (
      <Match2
        setFirstSelectedPlayer={setFirstSelectedPlayer}
        setSecondSelectedPlayer={setSecondSelectedPlayer}
        firstSelectedPlayer={firstSelectedPlayer}
        secondSelectedPlayer={secondSelectedPlayer}
        setSelectedPage={setSelectedPage}
      />
    ) : (
      <Homepage2
        firstSelectedPlayer={firstSelectedPlayer}
        secondSelectedPlayer={secondSelectedPlayer}
        setFirstSelectedPlayer={setFirstSelectedPlayer}
        setSecondSelectedPlayer={setSecondSelectedPlayer}
        setSelectedPage={setSelectedPage}
      />
    )
  );
}

export default App;
