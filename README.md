# Rulers

Displays vertical ruler lines at configurable column positions in the Markdown editor.

Works correctly with gutters (e.g. code folding) and readable line length layouts where `cm-content` is centered or width-limited.

## Options

| Option      | Description                                                                                                                   | Default |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- | ------- |
| Columns     | A comma separated list of columns where rulers should be displayed                                                            | 80      |
| Colors      | A comma separated list of colors in hex format for rulers. If no color is specified, the color is based on the current theme. | ''      |
| Line Styles | A comma separated list of styles for rulers. Options are 'solid', 'dashed' or 'dotted'                                        | 'solid' |

Note: Whitespaces are ignored and can be used for better readability.

## Example

<table>
    <tr>
        <th>Config</th>
        <th>Result</th>
    </tr>
    <tr>
        <td>
        <pre>
Columns: 60, 80, 100
Colors: #5a5a5a, #facc14, #f87272
Line Styles: solid</pre>
        </td>
        <td>
            <img src="./img/example.png" alt="example rulers" width="400"/>
        </td>
    </tr>
</table>

## Changelog

### 2.0.0

- Support Inkdrop v6
- Migrated from CodeMirror v5 to v6

## Acknowledgements

Thanks to @mravenel for creating this plugin.
