'use strict';

const { ViewPlugin } = require('@codemirror/view');

function createRulersExtension(rulers) {
    class RulersPlugin {
        constructor(view) {
            this.containerDom = view.dom.appendChild(
                document.createElement('div'),
            );
            this.containerDom.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                overflow: hidden;
            `;

            this.rulerDoms = rulers.map(({ column, color, lineStyle }) => {
                const dom = this.containerDom.appendChild(
                    document.createElement('div'),
                );
                dom.style.cssText = `
                    position: absolute;
                    border-right: 1px ${lineStyle || 'solid'} ${color || 'gray'};
                    height: 100%;
                    opacity: 0.7;
                    width: 0;
                `;
                return { dom, column };
            });

            this.schedulePositionUpdate(view);
        }

        update(update) {
            if (update.geometryChanged || update.viewportChanged) {
                this.schedulePositionUpdate(update.view);
            }
        }

        // coordsAtPos reads the DOM layout, which is forbidden during a CM6 update
        // cycle. requestMeasure schedules the read in the measure phase and the write
        // after, keeping the two safely separated.
        schedulePositionUpdate(view) {
            view.requestMeasure({
                read: v => {
                    const lineStart = v.state.doc.lineAt(v.viewport.from).from;
                    const coords = v.coordsAtPos(lineStart);
                    if (!coords) return null;
                    return {
                        baseLeft:
                            coords.left -
                            this.containerDom.getBoundingClientRect().left,
                        charWidth: v.defaultCharacterWidth,
                    };
                },
                write: measure => {
                    if (!measure) return;
                    this.rulerDoms.forEach(({ dom, column }) => {
                        dom.style.left = `${measure.baseLeft + column * measure.charWidth}px`;
                    });
                },
            });
        }

        destroy() {
            this.containerDom.remove();
        }
    }

    return ViewPlugin.fromClass(RulersPlugin);
}

module.exports = { createRulersExtension };
