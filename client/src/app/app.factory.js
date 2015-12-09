(function() {

    'use strict';

    angular
        .module('app')
        .factory('graphFactory', GraphFactory);



    /*@ngInject*/
    function GraphFactory() {
        function fastCreate(posX, posY, inCnt, outCnt, label) {
            var portsIn = _.range(inCnt).map(function (a) {
                return "IN" + a;
            });
            var portsOut = _.range(outCnt).map(function (a) {
                return "OUT" + a;
            });
            return new flink.Atomic({
                position: {x: posX, y: posY},
                inPorts: portsIn,
                java: "package blab.ablab.alba\nimport stuff",
                outPorts: portsOut,
                attrs: {
                    '.label': {text: 'Number Filter'}
                }
            });
        }

        var flink = {};

        flink.renderNumberFilter = function(posX, posY, inCnt, outCnt) {
            return fastCreate(posX, posY, inCnt, outCnt, 'Number Filter');
        };

        flink.renderStringFilter = function(posX, posY, inCnt, outCnt) {
            return fastCreate(posX, posY, inCnt, outCnt, 'String Filter');
        };

        flink.Model = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

            markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
            portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

            defaults: joint.util.deepSupplement({

                type: 'devs.Model',
                size: {
                    width: 1,
                    height: 1
                },

                inPorts: [],
                outPorts: [],

                attrs: {
                    '.': {
                        magnet: false
                    },
                    '.body': {
                        width: 150,
                        height: 250,
                        stroke: '#000000'
                    },
                    '.port-body': {
                        r: 10,
                        magnet: true,
                        stroke: '#000000'
                    },
                    text: {
                        'pointer-events': 'none'
                    },
                    '.label': {
                        text: 'Model',
                        'ref-x': .5,
                        'ref-y': 10,
                        ref: '.body',
                        'text-anchor': 'middle',
                        fill: '#000000'
                    },
                    '.inPorts .port-label': {
                        x: -15,
                        dy: 4,
                        'text-anchor': 'end',
                        fill: '#000000'
                    },
                    '.outPorts .port-label': {
                        x: 15,
                        dy: 4,
                        fill: '#000000'
                    }
                }

            }, joint.shapes.basic.Generic.prototype.defaults),

            getPortAttrs: function(portName, index, total, selector, type) {

                var attrs = {};

                var portClass = 'port' + index;
                var portSelector = selector + '>.' + portClass;
                var portLabelSelector = portSelector + '>.port-label';
                var portBodySelector = portSelector + '>.port-body';

                attrs[portLabelSelector] = {
                    text: portName
                };
                attrs[portBodySelector] = {
                    port: {
                        id: portName || _.uniqueId(type),
                        type: type
                    }
                };
                attrs[portSelector] = {
                    ref: '.body',
                    'ref-y': (index + 0.5) * (1 / total)
                };

                if (selector === '.outPorts') {
                    attrs[portSelector]['ref-dx'] = 0;
                }

                return attrs;
            }
        }));


        flink.Atomic = flink.Model.extend({

            defaults: joint.util.deepSupplement({

                type: 'devs.Atomic',
                size: {
                    width: 80,
                    height: 80
                },
                attrs: {
                    '.body': {
                        fill: 'salmon'
                    },
                    '.label': {
                        text: 'Atomic'
                    },
                    '.inPorts .port-body': {
                        fill: 'PaleGreen'
                    },
                    '.outPorts .port-body': {
                        fill: 'Tomato'
                    }
                }

            }, flink.Model.prototype.defaults)

        });

        // TODO add arrow for direction?
        flink.Link = joint.dia.Link.extend({
            defaults: {
                type: 'devs.Link',
                attrs: {
                    '.connection': {
                        'stroke-width': 2
                    }
                }
            }
        });

        flink.ModelView = joint.dia.ElementView.extend(joint.shapes.basic.PortsViewInterface);
        flink.AtomicView = flink.ModelView;
        flink.CoupledView = flink.ModelView;

        return flink;
    }
})();
