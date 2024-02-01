import { memo } from "react";
import { SimpleHandle } from "./handles";
import { Position } from "reactflow";

export enum NODE_TYPE {
  START = "start",
  END = "end",
  MIDDLE = "middle",
}

export const Node = memo<{ data: any; isConnectable: boolean }>(({ data, isConnectable }) => {
  const nodeType = data.type;
  const showTargetHandle = nodeType === NODE_TYPE.END || nodeType === NODE_TYPE.MIDDLE;
  const showSourceHandle = nodeType === NODE_TYPE.START || nodeType === NODE_TYPE.MIDDLE;

  return (
    <div className="py-2 px-4 m-1 rounded-md border-2 bg-white" style={{ borderColor: "skyblue" }}>
      {showTargetHandle && (
        <SimpleHandle type="target" position={Position.Left} isConnectable={isConnectable} />
      )}
      {showSourceHandle && (
        <SimpleHandle type="source" position={Position.Right} isConnectable={isConnectable} />
      )}
      <div className="text-xs text-gray-800">{data.label}</div>
    </div>
  );
});

Node.displayName = "LBNode";

export const customNodeSelectors = {
  basic: Node,
};

export interface Node {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    ports?: string[];
    depends_on?: string[];
    type: NODE_TYPE;
  };
  type: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
}
