import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('star-rating', 'StarRatingComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject();
  equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  equal(component._state, 'inDOM');
});
