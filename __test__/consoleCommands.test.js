import { render } from '@testing-library/react';
import React, { useEffect, useState, useRef } from 'react';
import ConsoleCommands from '../src/components/Universal-Components/ConsoleCommands';

describe('ConsoleCommands', () => {
  let budgetTestMock, customCommandMock;

  beforeEach(() => {
    budgetTestMock = jest.fn();
    customCommandMock = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setup = () => {
    render(
      <ConsoleCommands
        cmdPassThru={{
          budgetTest: budgetTestMock,
          customCmd: customCommandMock,
        }}
      />
    );
  };

  it('sets up window.runCommand', () => {
    setup();
    expect(typeof window.runCommand).toBe('function');
  });

  it("runs the 'hello' command", () => {
    setup();
    window.runCommand('hello');
    expect(console.log).toHaveBeenCalledWith('Command received: hello');
    expect(console.log).toHaveBeenCalledWith('Hello, world!');
  });

  it("runs the 'date' command", () => {
    setup();
    window.runCommand('date');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/Today's date is:/)
    );
  });

  it("runs the 'time' command", () => {
    setup();
    window.runCommand('time');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/Current time is:/)
    );
  });

  it("calls budgetTest function when 'budgetTest' command is run", () => {
    setup();
    window.runCommand('budgetTest');
    expect(budgetTestMock).toHaveBeenCalled();
  });

  it('calls custom command from cmdPassThru', () => {
    setup();
    window.runCommand('customCmd', 'arg1', 42);
    expect(customCommandMock).toHaveBeenCalledWith('arg1', 42);
  });

  it("logs 'Unknown command' for unrecognized commands", () => {
    setup();
    window.runCommand('nonexistentCommand');
    expect(console.log).toHaveBeenCalledWith('Unknown command');
  });
});
