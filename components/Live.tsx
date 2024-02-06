import {
  useMyPresence,
  useOthers,
} from "@/liveblocks.config";
import LiveCursors from "./cursor/LiveCursors";
import { useCallback, useEffect, useState } from "react";
import CursorChat from "./cursor/CursorChat";
import { CursorMode, CursorState } from "@/types/type";

const Live = () => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] =
    useMyPresence() as any;
  const [cursorState, setCursorState] =
    useState<CursorState>({
      mode: CursorMode.Hidden,
    });

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();

      const x =
        event.clientX -
        event.currentTarget.getBoundingClientRect().x;
      const y =
        event.clientY -
        event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({ cursor: { x, y } });
    },
    []
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      const x =
        event.clientX -
        event.currentTarget.getBoundingClientRect().x;
      const y =
        event.clientY -
        event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({ cursor: { x, y } });
    },
    []
  );

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent) => {
      setCursorState({ mode: CursorMode.Hidden });
      updateMyPresence({ cursor: null, message: null });
    },
    []
  );

  useEffect(() => {
    const onKeyUp = (e: React.KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "esc") {
        updateMyPresence({ message: "" });
        setCursorState({
          mode: CursorMode.Hidden,
        });
      }
    };
    const onKeyDown = (e: React.KeyboardEvent) => {};
  }, []);

  return (
    <div
      className='h-[100vh] w-full flex justify-center items-center text-center'
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
    >
      <h1 className='text-2xl text-white'>Figmini</h1>;
      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      <LiveCursors others={others} />
    </div>
  );
};

export default Live;
