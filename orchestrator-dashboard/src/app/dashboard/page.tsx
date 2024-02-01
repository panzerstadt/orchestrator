"use client";

import { useEffect, useState } from "react";
import Dagre from "@dagrejs/dagre";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { DevResponse } from "../api/data/dev/route";
import { Edge, NODE_TYPE, Node, customNodeSelectors } from "./nodes";

const Dashboard = () => {
  const { fitView } = useReactFlow();
  const [graph, setGraph] = useState<{ nodes: Node[]; edges: Edge[] }>();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    fetch("/api/data/dev")
      .then((res) => res.json())
      .then((res: DevResponse) => {
        const services = res.services;

        const newEdges = services
          .filter((s) => !!s.depends_on)
          .map((service) => {
            return service.depends_on!.map((dep) => {
              return {
                id: `${dep}-${service.label}`,
                source: dep,
                target: service.label,
                animated: true,
                // type: "smoothstep",
              };
            });
          })
          .flat();

        const newNodes = services.map((service, i) => {
          return {
            id: service.label,
            position: {
              x: 0,
              y: 0, //50 * i,
            },
            data: {
              label: service.label,
              ports: service.ports,
              depends_on: service.depends_on,
              type: NODE_TYPE.MIDDLE,
            },
            type: "basic",
          };
        });

        setGraph({ nodes: newNodes, edges: newEdges });
        setNodes(newNodes);
        setEdges(newEdges);
      });
  }, []);

  useEffect(() => {
    if (nodes.length === 0) return;
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: "LR" });
    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    // @ts-ignore
    nodes.forEach((node) => g.setNode(node.id, { ...node, width: 100, height: 80 }));
    Dagre.layout(g, { nodesep: 50, marginx: 10 });

    setNodes([
      ...nodes.map((node) => {
        const { x, y } = g.node(node.id);
        return { ...node, position: { x, y } };
      }),
    ]);

    setTimeout(() => {
      window.requestAnimationFrame(() => {
        fitView({ padding: 0.5, nodes: nodes });
      });
    }, 30);
  }, [graph]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView={true}
        nodeTypes={customNodeSelectors}
      >
        <MiniMap nodeStrokeWidth={3} pannable />
        <Controls />
        <Background color="#4C3B4D" />
      </ReactFlow>
    </div>
  );
};

const WrappedDashboard = () => {
  return (
    <ReactFlowProvider>
      <Dashboard />
    </ReactFlowProvider>
  );
};

export default WrappedDashboard;
