// registro i componenti in questo file

AFRAME.registerComponent('foo', {
    schema: {
        color: {default: 'red'},
        size: {type: 'int', default: 5}
    },
    init: function (){}, /* Called once when the component is initialized */
    update: function () {}, /* Called both when the component is init and whenever any of the component’s prop is updated  */
    tick: function () {}, /* Called on each render loop or tick of the scene */
    remove: function () {} /* Called when the component is removed from the entity */
});