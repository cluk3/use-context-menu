import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import ContextMenuWrapper from "./index";

describe("E2E useContextMenu", () => {
  it("makes the menu visible when contextMenu event fires on trigger and disappears when clicking outside", async () => {
    const { getByTestId, getByText } = render(<ContextMenuWrapper />);

    const trigger = getByTestId("trigger");
    const contextMenu = getByTestId("contextMenu");

    expect(trigger).toBeInTheDocument();

    expect(contextMenu).not.toBeVisible();

    fireEvent.contextMenu(trigger);

    expect(contextMenu).toBeVisible();

    fireEvent.mouseDown(getByText("outside"));

    expect(contextMenu).not.toBeVisible();
  });

  it("doesn't appear when disabled", async () => {
    const { getByTestId, rerender } = render(
      <ContextMenuWrapper triggerConfig={{ disable: true }} />
    );

    const trigger = getByTestId("trigger");
    const contextMenu = getByTestId("contextMenu");

    expect(contextMenu).not.toBeVisible();

    fireEvent.contextMenu(trigger);

    expect(contextMenu).not.toBeVisible();

    rerender(<ContextMenuWrapper triggerConfig={{ disable: false }} />);

    fireEvent.contextMenu(trigger);

    expect(contextMenu).toBeVisible();
  });
  it("doesn't appear when disabled with shift", async () => {
    const { getByTestId, rerender } = render(
      <ContextMenuWrapper triggerConfig={{ disableIfShiftIsPressed: true }} />
    );

    const trigger = getByTestId("trigger");
    const contextMenu = getByTestId("contextMenu");

    expect(contextMenu).not.toBeVisible();

    fireEvent.contextMenu(trigger, { shiftKey: true });

    expect(contextMenu).not.toBeVisible();

    rerender(
      <ContextMenuWrapper triggerConfig={{ disableIfShiftIsPressed: false }} />
    );

    fireEvent.contextMenu(trigger, { shiftKey: true });

    expect(contextMenu).toBeVisible();
  });

  describe("Hold to display MOUSE", () => {
    it("shows the menu when holding for the specified time", async () => {
      const { getByTestId } = render(
        <ContextMenuWrapper
          triggerConfig={{ holdToDisplay: { mouse: 1000 } }}
        />
      );

      jest.useFakeTimers();

      const trigger = getByTestId("trigger");
      const contextMenu = getByTestId("contextMenu");

      expect(contextMenu).not.toBeVisible();
      fireEvent.mouseDown(trigger);

      expect(contextMenu).not.toBeVisible();

      act(() => jest.runAllTimers());

      expect(contextMenu).toBeVisible();
    });

    it("it doesn't show the menu when holding below the threshold", async () => {
      const { getByTestId } = render(
        <ContextMenuWrapper
          triggerConfig={{ holdToDisplay: { mouse: 1000 } }}
        />
      );

      jest.useFakeTimers();

      const trigger = getByTestId("trigger");
      const contextMenu = getByTestId("contextMenu");

      expect(contextMenu).not.toBeVisible();

      fireEvent.mouseDown(trigger);
      fireEvent.mouseUp(trigger);
      act(() => jest.runAllTimers());

      expect(contextMenu).not.toBeVisible();

      fireEvent.mouseDown(trigger);
      act(() => jest.advanceTimersByTime(900));
      fireEvent.mouseOut(trigger);
      act(() => jest.runAllTimers());

      expect(contextMenu).not.toBeVisible();

      fireEvent.mouseDown(trigger);
      act(() => jest.advanceTimersByTime(1100));
      fireEvent.mouseOut(trigger);
      act(() => jest.runAllTimers());

      expect(contextMenu).toBeVisible();
    });
  });

  describe("Hold to display TOUCH", () => {
    it("shows the menu when holding for the specified time", async () => {
      const { getByTestId } = render(
        <ContextMenuWrapper
          triggerConfig={{ holdToDisplay: { touch: 1000 } }}
        />
      );

      jest.useFakeTimers();

      const trigger = getByTestId("trigger");
      const contextMenu = getByTestId("contextMenu");

      expect(contextMenu).not.toBeVisible();
      fireEvent.touchStart(trigger, { touches: [{ pageX: 0, pageY: 0 }] });

      expect(contextMenu).not.toBeVisible();

      act(() => jest.runAllTimers());

      expect(contextMenu).toBeVisible();
    });

    it("it doesn't show the menu when holding below the threshold", async () => {
      const { getByTestId } = render(
        <ContextMenuWrapper
          triggerConfig={{ holdToDisplay: { touch: 1000 } }}
        />
      );

      jest.useFakeTimers();

      const trigger = getByTestId("trigger");
      const contextMenu = getByTestId("contextMenu");

      expect(contextMenu).not.toBeVisible();

      fireEvent.touchStart(trigger, { touches: [{ pageX: 0, pageY: 0 }] });

      fireEvent.touchEnd(trigger);
      act(() => jest.runAllTimers());

      expect(contextMenu).not.toBeVisible();

      fireEvent.touchStart(trigger, { touches: [{ pageX: 0, pageY: 0 }] });

      act(() => jest.advanceTimersByTime(900));
      fireEvent.touchCancel(trigger);
      act(() => jest.runAllTimers());

      expect(contextMenu).not.toBeVisible();

      fireEvent.touchStart(trigger, { touches: [{ pageX: 0, pageY: 0 }] });

      act(() => jest.advanceTimersByTime(900));
      fireEvent.touchMove(trigger);
      act(() => jest.runAllTimers());

      expect(contextMenu).not.toBeVisible();

      fireEvent.touchStart(trigger, { touches: [{ pageX: 0, pageY: 0 }] });

      act(() => jest.advanceTimersByTime(1100));
      fireEvent.touchEnd(trigger);
      act(() => jest.runAllTimers());

      expect(contextMenu).toBeVisible();
    });
  });
});
