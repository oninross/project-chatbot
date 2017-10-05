'use strict';

import Conversation from '../conversation';

describe('Conversation View', function() {

  beforeEach(() => {
    this.conversation = new Conversation();
  });

  it('Should run a few assertions', () => {
    expect(this.conversation);
  });

});
