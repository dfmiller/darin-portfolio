<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent, type Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    editable?: boolean
  }>(),
  {
    modelValue: '',
    label: 'Rich text editor',
    placeholder: 'Start typing…',
    editable: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const headingLevels = [1, 2, 3, 4, 5, 6] as const

interface ToolbarButton {
  name: string
  icon: string
  title: string
  run: (editor: Editor) => void
  isActive?: (editor: Editor) => boolean
  isDisabled?: (editor: Editor) => boolean
}

const buttons: ToolbarButton[] = [
  {
    name: 'bold',
    icon: 'mdi-format-bold',
    title: 'Bold',
    run: (e) => e.chain().focus().toggleBold().run(),
    isActive: (e) => e.isActive('bold'),
  },
  {
    name: 'italic',
    icon: 'mdi-format-italic',
    title: 'Italic',
    run: (e) => e.chain().focus().toggleItalic().run(),
    isActive: (e) => e.isActive('italic'),
  },
  {
    name: 'strike',
    icon: 'mdi-format-strikethrough',
    title: 'Strikethrough',
    run: (e) => e.chain().focus().toggleStrike().run(),
    isActive: (e) => e.isActive('strike'),
  },
  {
    name: 'bulletList',
    icon: 'mdi-format-list-bulleted',
    title: 'Bullet list',
    run: (e) => e.chain().focus().toggleBulletList().run(),
    isActive: (e) => e.isActive('bulletList'),
  },
  {
    name: 'orderedList',
    icon: 'mdi-format-list-numbered',
    title: 'Numbered list',
    run: (e) => e.chain().focus().toggleOrderedList().run(),
    isActive: (e) => e.isActive('orderedList'),
  },
  {
    name: 'blockquote',
    icon: 'mdi-format-quote-open',
    title: 'Blockquote',
    run: (e) => e.chain().focus().toggleBlockquote().run(),
    isActive: (e) => e.isActive('blockquote'),
  },
  {
    name: 'codeBlock',
    icon: 'mdi-code-braces',
    title: 'Code block',
    run: (e) => e.chain().focus().toggleCodeBlock().run(),
    isActive: (e) => e.isActive('codeBlock'),
  },
  {
    name: 'undo',
    icon: 'mdi-undo',
    title: 'Undo',
    run: (e) => e.chain().focus().undo().run(),
    isDisabled: (e) => !e.can().undo(),
  },
  {
    name: 'redo',
    icon: 'mdi-redo',
    title: 'Redo',
    run: (e) => e.chain().focus().redo().run(),
    isDisabled: (e) => !e.can().redo(),
  },
]

const editor = useEditor({
  content: props.modelValue,
  editable: props.editable,
  editorProps: {
    attributes: {
      'aria-label': props.label,
      'aria-multiline': 'true',
    },
  },
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.isEmpty ? '' : editor.getHTML())
  },
})

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return
    if (value !== editor.value.getHTML()) {
      editor.value.commands.setContent(value, { emitUpdate: false })
    }
  }
)

watch(
  () => props.editable,
  (value) => editor.value?.setEditable(value)
)

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <div class="base-rich-text">
    <div class="editor-label">{{ label }}</div>
    <div
      v-if="editor && editable"
      class="toolbar"
      role="toolbar"
      :aria-label="`${label} formatting`"
    >
      <button
        v-for="button in buttons.slice(0, 3)"
        :key="button.name"
        type="button"
        :aria-label="button.title"
        :aria-pressed="button.isActive?.(editor)"
        :title="button.title"
        :class="{ active: button.isActive?.(editor) }"
        :disabled="button.isDisabled?.(editor)"
        @click="button.run(editor)"
      >
        <v-icon :icon="button.icon" size="small" aria-hidden="true" />
      </button>

      <v-menu location="bottom start">
        <template #activator="{ props: menuProps }">
          <button
            v-bind="menuProps"
            type="button"
            aria-label="Text style"
            title="Text style"
            class="toolbar-menu-button"
          >
            <v-icon icon="mdi-format-header-pound" size="small" aria-hidden="true" />
            <v-icon icon="mdi-chevron-down" size="x-small" aria-hidden="true" />
          </button>
        </template>
        <v-list density="compact">
          <v-list-item
            title="Normal text"
            prepend-icon="mdi-format-paragraph"
            :active="editor.isActive('paragraph')"
            @click="editor.chain().focus().setParagraph().run()"
          />
          <v-list-item
            v-for="level in headingLevels"
            :key="level"
            :title="`Heading ${level}`"
            :prepend-icon="`mdi-format-header-${level}`"
            :active="editor.isActive('heading', { level })"
            @click="editor.chain().focus().setHeading({ level }).run()"
          />
        </v-list>
      </v-menu>

      <button
        v-for="button in buttons.slice(3)"
        :key="button.name"
        type="button"
        :aria-label="button.title"
        :aria-pressed="button.isActive?.(editor)"
        :title="button.title"
        :class="{ active: button.isActive?.(editor) }"
        :disabled="button.isDisabled?.(editor)"
        @click="button.run(editor)"
      >
        <v-icon :icon="button.icon" size="small" aria-hidden="true" />
      </button>
    </div>

    <EditorContent :editor="editor" class="editor" />
  </div>
</template>

<style scoped>
.base-rich-text {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
}

.editor-label {
  display: block;
  padding: 8px 12px 0;
  color: rgb(var(--v-theme-on-surface));
  font-size: 0.875rem;
  font-weight: 600;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 6px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface-light));
  color: rgb(var(--v-theme-on-surface-light));
}

.toolbar button {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.toolbar .toolbar-menu-button {
  width: 48px;
}

.toolbar button:hover:not(:disabled) {
  background: rgba(var(--v-theme-on-surface), 0.08);
}

.toolbar button.active {
  background: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.toolbar button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbar button:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Larger touch targets on touch devices. */
@media (pointer: coarse) {
  .toolbar button {
    width: 44px;
    height: 44px;
  }

  .toolbar .toolbar-menu-button {
    width: 56px;
  }
}

.editor :deep(.tiptap) {
  min-height: 150px;
  padding: 12px;
  outline: none;
}

.editor :deep(.tiptap:focus-visible) {
  box-shadow: inset 0 0 0 2px rgb(var(--v-theme-primary));
}

.editor :deep(.tiptap p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  height: 0;
  color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
  pointer-events: none;
}

.editor :deep(.tiptap ul),
.editor :deep(.tiptap ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}
 
.editor :deep(.tiptap ul) {
  list-style-type: disc;
}
 
.editor :deep(.tiptap ol) {
  list-style-type: decimal;
}
 
.editor :deep(.tiptap li) {
  margin: 0.25em 0;
}
 
.editor :deep(.tiptap li > p) {
  margin: 0;
}
 
.editor :deep(.tiptap ul ul),
.editor :deep(.tiptap ol ol),
.editor :deep(.tiptap ul ol),
.editor :deep(.tiptap ol ul) {
  margin: 0.25em 0;
}
 
.editor :deep(.tiptap blockquote) {
  border-left: 3px solid rgba(var(--v-border-color), var(--v-border-opacity));
  margin-left: 0;
  padding-left: 12px;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.editor :deep(.tiptap pre) {
  background: rgb(var(--v-theme-surface-light));
  color: rgb(var(--v-theme-on-surface-light));
  padding: 10px 12px;
  border-radius: 6px;
  overflow-x: auto;
}
</style>