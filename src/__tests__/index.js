import { renderHook, act } from "@testing-library/react-hooks";
import useContextMenu, { keyCodes } from "../useContextMenu";

test("useContextMenu result is correct", () => {
  const { result } = renderHook(() => useContextMenu());

  expect(result.current.length).toBe(4);

  expect(result.current).toMatchSnapshot();
});

test("useContextMenu register event listeners only when visible", () => {
  const addEventListener = jest.spyOn(document, "addEventListener");
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = {
    getBoundingClientRect: jest.fn(() => ({ height: 100, width: 100 }))
  };

  expect(addEventListener).not.toHaveBeenCalled();

  act(() => {
    result.current[3].setVisible(true);
    result.current[3].setCoords([100, 100]);
  });

  expect(addEventListener).toHaveBeenCalledTimes(5);
  expect(addEventListener.mock.calls.map(call => call[0])).toEqual([
    "mousedown",
    "touchstart",
    "scroll",
    "contextmenu",
    "keydown"
  ]);
});

test("useContextMenu sets correctly the style when changing visibility", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = {
    getBoundingClientRect: jest.fn(() => ({ height: 100, width: 100 }))
  };

  expect(result.current[0].style).toEqual({
    opacity: 0,
    pointerEvents: "none",
    position: "fixed"
  });

  act(() => {
    result.current[3].setVisible(true);
    result.current[3].setCoords([100, 100]);
  });

  expect(result.current[0].style).toEqual({
    left: "100px",
    opacity: 1,
    pointerEvents: "auto",
    position: "fixed",
    top: "100px"
  });

  act(() => {
    result.current[3].setVisible(false);
  });

  expect(result.current[0].style).toEqual({
    opacity: 0,
    pointerEvents: "none",
    position: "fixed"
  });
});

test("useContextMenu keeps the menu inside the viewport", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = {
    getBoundingClientRect: jest.fn(() => ({ height: 100, width: 100 }))
  };

  expect(result.current[0].style).toEqual({
    opacity: 0,
    pointerEvents: "none",
    position: "fixed"
  });

  act(() => {
    result.current[3].setVisible(true);
    result.current[3].setCoords([1000, 700]);
  });

  expect(result.current[0].style).toEqual({
    left: "900px",
    opacity: 1,
    pointerEvents: "auto",
    position: "fixed",
    top: "600px"
  });
});

test("useContextMenu hides the menu when a new contextmenu event is triggered", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = {
    getBoundingClientRect: jest.fn(() => ({ height: 100, width: 100 }))
  };

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new MouseEvent("contextmenu");

    document.dispatchEvent(event);
  });

  expect(result.current[3].isVisible).toEqual(false);
});

test("useContextMenu hides the menu when clicking outside", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = {
    getBoundingClientRect: jest.fn(() => ({ height: 100, width: 100 })),
    contains: () => false
  };

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new MouseEvent("mousedown");

    document.dispatchEvent(event);
  });

  expect(result.current[3].isVisible).toEqual(false);
});

test("useContextMenu hides the menu when clicking outside", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = {
    getBoundingClientRect: jest.fn(() => ({ height: 100, width: 100 })),
    contains: () => false
  };

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new MouseEvent("touchstart");

    document.dispatchEvent(event);
  });

  expect(result.current[3].isVisible).toEqual(false);
});

test("useContextMenu hides the menu on scroll", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = {
    getBoundingClientRect: jest.fn(() => ({ height: 100, width: 100 })),
    contains: () => false
  };

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    document.dispatchEvent(new Event("scroll"));
  });

  expect(result.current[3].isVisible).toEqual(false);
});

test("useContextMenu hides the menu on ESCAPE key press", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = {
    getBoundingClientRect: jest.fn(() => ({ height: 100, width: 100 })),
    contains: () => false
  };

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new KeyboardEvent("keydown", { keyCode: keyCodes.ESCAPE });
    document.dispatchEvent(event);
  });

  expect(result.current[3].isVisible).toEqual(false);
});

test("useContextMenu hides the menu on ENTER key press", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = {
    getBoundingClientRect: jest.fn(() => ({ height: 100, width: 100 })),
    contains: () => false
  };

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new KeyboardEvent("keydown", { keyCode: keyCodes.ENTER });
    document.dispatchEvent(event);
  });

  expect(result.current[3].isVisible).toEqual(false);
});

test("useContextMenu index of item selected by keyboard gets reset when closing the menu", () => {
  let selectedEl = 0;
  const { result } = renderHook(() =>
    useContextMenu({
      handleElementSelect: _selectedEl => (selectedEl = _selectedEl)
    })
  );

  result.current[0].ref.current = {
    getBoundingClientRect: jest.fn(() => ({ height: 100, width: 100 })),
    contains: () => false
  };

  result.current[1].ref(1);
  result.current[1].ref(2);
  result.current[1].ref(3);

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new KeyboardEvent("keydown", { keyCode: 40 });

    document.dispatchEvent(event);
  });

  act(() => {
    const event = new MouseEvent("touchstart");

    document.dispatchEvent(event);
  });

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new KeyboardEvent("keydown", { keyCode: 40 });

    document.dispatchEvent(event);
  });

  expect(selectedEl).toEqual(1);
});
