/* @flow */
import React, { Component, useState, useEffect, useRef } from 'react';
import RichTextEditor, { createEmptyValue } from './RichTextEditor';
import { convertToRaw } from 'draft-js';

import { getTextAlignBlockMetadata, getTextAlignClassName, getTextAlignStyles } from './lib/blockStyleFunctions';
import ButtonGroup from './ui/ButtonGroup';
import Dropdown from './ui/Dropdown';
import IconButton from './ui/IconButton';

const EditorDemo = () => {

  const [format, setFormat] = useState("html")
  const [value, setValue] = useState(createEmptyValue)
  const [readOnly, setReadOnly] = useState(false)

  const toolbarRef = useRef()

  useEffect(() => {
    setInterval(() => {
      console.log(toolbarRef.current.clientHeight)
    }, 1000)
  }, [])


  function _logState() {
    let editorState = value.getEditorState();
    let contentState = window.contentState = editorState.getCurrentContent().toJS();
    console.log(contentState);
  }

  function _logStateRaw() {
    let editorState = value.getEditorState();
    let contentState = editorState.getCurrentContent();
    let rawContentState = window.rawContentState = convertToRaw(contentState);
    console.log(JSON.stringify(rawContentState));
  }

  function _onChange(value) {
    setValue(value)
  }

  function _onChangeSource(event) {
    let source = event.target.value;
    let oldValue = value;
    setValue(oldValue.setContentFromString(source, format, { customBlockFn: getTextAlignBlockMetadata }))
  }

  function _onChangeFormat(event) {
    setFormat(event.target.value)
  }

  function _onChangeReadOnly(event) {
    setReadOnly(event.target.checked )
  }


  return <div className="editor-demo">
      <div className="row">
        <p>This is a demo of the <a href="https://github.com/sstur/react-rte" target="top">react-rte</a> editor.</p>
      </div>
      <div className="row">
        <RichTextEditor
          value={value}
          toolbarRef={toolbarRef}
          onChange={_onChange}
          className="react-rte-demo"
          placeholder="Tell a story"
          toolbarClassName="demo-toolbar"
          editorClassName="demo-editor"
          readOnly={readOnly}
          blockStyleFn={getTextAlignClassName}
          customControls={[
            // eslint-disable-next-line no-unused-vars
            (setValue, getValue, editorState) => {
              let choices = new Map([
                ['1', { label: '1' }],
                ['2', { label: '2' }],
                ['3', { label: '3' }],
              ]);
              return (
                <ButtonGroup key={1}>
                  <Dropdown
                    choices={choices}
                    selectedKey={getValue('my-control-name')}
                    onChange={(value) => setValue('my-control-name', value)}
                  />
                </ButtonGroup>
              );
            },
            <ButtonGroup key={2}>
              <IconButton
                label="Remove Link"
                iconName="remove-link"
                focusOnClick={false}
                onClick={() => console.log('You pressed a button')}
              />
            </ButtonGroup>,
          ]}
        />
      </div>
      <div className="row">
        <label className="radio-item">
          <input
            type="radio"
            name="format"
            value="html"
            checked={format === 'html'}
            onChange={_onChangeFormat}
          />
          <span>HTML</span>
        </label>
        <label className="radio-item">
          <input
            type="radio"
            name="format"
            value="markdown"
            checked={format === 'markdown'}
            onChange={_onChangeFormat}
          />
          <span>Markdown</span>
        </label>
        <label className="radio-item">
          <input
            type="checkbox"
            onChange={_onChangeReadOnly}
            checked={readOnly}
          />
          <span>Editor is read-only</span>
        </label>
      </div>
      <div className="row">
        <textarea
          className="source"
          placeholder="Editor Source"
          value={value.toString(format, { blockStyleFn: getTextAlignStyles })}
          onChange={_onChangeSource}
        />
      </div>
      <div className="row btn-row">
        <span className="label">Debugging:</span>
        <button className="btn" onClick={_logState}>Log Content State</button>
        <button className="btn" onClick={_logStateRaw}>Log Raw</button>
      </div>
    </div>;

}


export default EditorDemo