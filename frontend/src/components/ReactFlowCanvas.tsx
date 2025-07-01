import React from "react";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

const webhookURL = "http://localhost:5000/webhook"; // Can change it if required

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    position: { x: 100, y: 150 },
    data: {
      label: (
        <div>
          <strong>Standard Webhook Connector</strong>
          <br />
          <code>{webhookURL}</code>
        </div>
      ),
    },
  },
  {
    id: "2",
    type: "default",
    position: { x: 400, y: 150 },
    data: {
      label: (
        <div>
          <strong>Autodesk ACC Connector</strong>
          <br />
          <label>
            Project ID: <input type="text" placeholder="project_id" />
          </label>
          <br />
          <label>
            Folder Path: <input type="text" placeholder="folder_path" />
          </label>
        </div>
      ),
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
];

export default function ReactFlowCanvas() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
