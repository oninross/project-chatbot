'use strict';

import Chat from '../chat';

describe('Chat View', function() {

  beforeEach(() => {
    this.chat = new Chat();
  });

  it('Should run a few assertions', () => {
    expect(this.chat);
  });

});
