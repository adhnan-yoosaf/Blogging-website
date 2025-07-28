import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ initialValue, onChange }) => {
    const editorRef = useRef(null);

    return (
        <>
            <Editor
                onEditorChange={onChange}
                apiKey='wo9l0anzsfewy19yu9tycb5kvp0g6zdvssiahf29h38b5rjp'
                onInit={(_evt, editor) => editorRef.current = editor}
                initialValue={initialValue || '<p></p>'}
                init={{
                    height: 400,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
        </>
    );
}

export default RichTextEditor;