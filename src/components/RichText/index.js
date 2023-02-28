import { useEffect, useState } from "react";
import {
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdTitle,
  MdFormatUnderlined,
  MdFormatBold,
  MdFormatItalic,
} from "react-icons/md";
import PropTypes from "prop-types";
import {
  DraftailEditor,
  BLOCK_TYPE,
  INLINE_STYLE,
  ENTITY_TYPE,
} from "draftail";
import "draft-js/dist/Draft.css";
import "draftail/dist/draftail.css";
import "./styles.js";
import { EditorState } from "draft-js";
import { createEditorStateFromRaw, serialiseEditorStateToRaw } from "draftail";
import { Container } from "./styles";

const exporterConfig = {
  blockToHTML: (block) => {
    if (block.type === BLOCK_TYPE.BLOCKQUOTE) {
      return <blockquote />;
    }

    // Discard atomic blocks, as they get converted based on their entity.
    if (block.type === BLOCK_TYPE.ATOMIC) {
      return {
        start: "",
        end: "",
      };
    }

    return null;
  },

  entityToHTML: (entity, originalText) => {
    if (entity.type === ENTITY_TYPE.LINK) {
      return <a href={entity.data.url}>{originalText}</a>;
    }

    if (entity.type === ENTITY_TYPE.IMAGE) {
      return <img src={entity.data.src} alt={entity.data.alt} />;
    }

    if (entity.type === ENTITY_TYPE.HORIZONTAL_RULE) {
      return <hr />;
    }

    return originalText;
  },
};

const importerConfig = {
  htmlToEntity: (nodeName, node, createEntity) => {
    // a tags will become LINK entities, marked as mutable, with only the URL as data.
    if (nodeName === "a") {
      return createEntity(ENTITY_TYPE.LINK, "MUTABLE", { url: node.href });
    }

    if (nodeName === "img") {
      return createEntity(ENTITY_TYPE.IMAGE, "IMMUTABLE", {
        src: node.src,
      });
    }

    if (nodeName === "hr") {
      return createEntity(ENTITY_TYPE.HORIZONTAL_RULE, "IMMUTABLE", {});
    }

    return null;
  },
  htmlToBlock: (nodeName) => {
    if (nodeName === "hr" || nodeName === "img") {
      // "atomic" blocks is how Draft.js structures block-level entities.
      return "atomic";
    }

    return null;
  },
};

function RichTextEditor({ onChange, readOnly }) {
  const [values, setValues] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  function onChange(e) {
    // console.log(toHTML(e));
    setValues(serialiseEditorStateToRaw(editorState));
    setEditorState(e);
  }

  useEffect(() => {
    setEditorState(
      createEditorStateFromRaw(
        !readOnly
          ? {
              blocks: [
                {
                  key: "6qiqi",
                  text: "MOBILITY ",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [
                    { offset: 0, length: 8, style: "BOLD" },
                    { offset: 0, length: 8, style: "ITALIC" },
                    { offset: 0, length: 8, style: "UNDERLINE" },
                  ],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: "cvbr6",
                  text: "",
                  type: "unordered-list-item",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: "e9idi",
                  text: "WARMP UP ",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [
                    { offset: 0, length: 8, style: "BOLD" },
                    { offset: 0, length: 8, style: "ITALIC" },
                    { offset: 0, length: 8, style: "UNDERLINE" },
                  ],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: "e3v2h",
                  text: "",
                  type: "unordered-list-item",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: "cqctj",
                  text: "SKILL / STRENGHT ",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [
                    { offset: 0, length: 16, style: "BOLD" },
                    { offset: 0, length: 16, style: "ITALIC" },
                    { offset: 0, length: 16, style: "UNDERLINE" },
                  ],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: "8t37q",
                  text: "",
                  type: "unordered-list-item",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: "551pf",
                  text: "WOD ",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [
                    { offset: 0, length: 3, style: "UNDERLINE" },
                    { offset: 0, length: 3, style: "ITALIC" },
                    { offset: 0, length: 3, style: "BOLD" },
                  ],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: "ejddu",
                  text: "",
                  type: "unordered-list-item",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: "cd9jb",
                  text: "EXTRA ",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [
                    { offset: 0, length: 5, style: "ITALIC" },
                    { offset: 0, length: 5, style: "BOLD" },
                    { offset: 0, length: 5, style: "UNDERLINE" },
                  ],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: "1b78p",
                  text: "",
                  type: "unordered-list-item",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
              ],
              entityMap: {},
            }
          : {
              blocks: [
                {
                  key: "6qiqi",
                  text: "Nenhum treino registrado até o momento.",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
              ],
              entityMap: {},
            }
      )
    );
  }, []);

  useEffect(() => {
    if (readOnly) {
      document.querySelector(".Draftail-Toolbar").style.display = "none";
    } else {
      document.querySelector(".Draftail-Toolbar").style.display = "block";
    }
  }, [readOnly]);

  return (
    <Container>
      <DraftailEditor
        editorState={editorState}
        onChange={onChange}
        blockTypes={[
          { type: BLOCK_TYPE.HEADER_THREE, icon: <MdTitle /> },
          {
            type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
            icon: <MdFormatListBulleted />,
            description: "Marcadores",
          },
          {
            type: BLOCK_TYPE.ORDERED_LIST_ITEM,
            icon: <MdFormatListNumbered />,
            description: "Numeração",
          },
        ]}
        inlineStyles={[
          {
            type: INLINE_STYLE.BOLD,
            icon: <MdFormatBold />,
            description: "Negrito",
          },
          {
            type: INLINE_STYLE.ITALIC,
            icon: <MdFormatItalic />,
            description: "Itálico",
          },
          {
            type: INLINE_STYLE.UNDERLINE,
            icon: <MdFormatUnderlined />,
            description: "Sublinhado",
          },
        ]}
        readOnly={readOnly}
      />
    </Container>
  );
}

RichTextEditor.propTypes = {
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

RichTextEditor.defaultProps = {
  readOnly: false,
  onChange: () => {},
};

export default RichTextEditor;
