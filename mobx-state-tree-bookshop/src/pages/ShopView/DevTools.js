import { inject, observer } from "mobx-react";
import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./DevTools.css";
import "react-tabs/style/react-tabs.css";

const DevTools = ({ history }) => {
  console.log(history);
  console.log(history.snapshots);
  return (
    <div className="devtools">
      <Tabs>
        <TabList>
          <Tab>Snapshots</Tab>
          <Tab>Patches</Tab>
          <Tab>Actions</Tab>
        </TabList>
        <TabPanel>
          {history.snapshots.map((snap, index) => (
            <HistoryEntry key={index} entry={snap} />
          ))}
        </TabPanel>
        <TabPanel>
          {history.patches.map((patch, index) => (
            <HistoryEntry key={index} entry={patch} />
          ))}
        </TabPanel>
        <TabPanel>
          {history.actions.map((action, index) => (
            <HistoryEntry key={index} entry={action} />
          ))}
        </TabPanel>
      </Tabs>
    </div>
  );
};

function HistoryEntry({ entry }) {
  return (
    <div>
      <pre className="history-entry" onClick={() => entry.replay()}>
        {JSON.stringify(entry.data, null, 2)}
      </pre>
    </div>
  );
}

export default inject("history")(observer(DevTools));
