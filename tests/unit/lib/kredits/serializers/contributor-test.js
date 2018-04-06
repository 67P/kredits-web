import { module, test } from 'ember-qunit';
import schemas from 'npm:kosmos-schemas';
import tv4 from 'npm:tv4';
import { ContributorSerializer } from 'kredits-web/lib/kredits';

module('Serializers contributor');

test('#serialize returns a valid JSON-LD representation', function(assert) {
  let serialized = ContributorSerializer.serialize({
    name: 'Satoshi Nakamoto',
    kind: 'person',
    github_uid: 123,
    github_username: 'therealsatoshi',
    wiki_username: 'Satoshi',
  });

  let valid = tv4.validate(JSON.parse(serialized), schemas['contributor']);
  assert.ok(valid);
});

test('#deserialize returns a valid object representation', function(assert) {
  let json = JSON.stringify({
    "@context": "https://schema.kosmos.org",
    "@type": "Contributor",
    "kind": "person",
    "name": "Satoshi Nakamoto",
    "accounts": [
      {
        "site": "github.com",
        "uid": 123,
        "username": "therealsatoshi",
        "url": "https://github.com/therealsatoshi"
      },
      {
        "site": "wiki.kosmos.org",
        "username": "Satoshi",
        "url": "https://wiki.kosmos.org/User:Satoshi"
      }
    ]
  });
  let deserialized = ContributorSerializer.deserialize(json);

  let expected = {
    name: 'Satoshi Nakamoto',
    kind: 'person',
    github_uid: 123,
    github_username: 'therealsatoshi',
    wiki_username: 'Satoshi',
    url: undefined,
    ipfsData: json,
  };
  assert.deepEqual(expected, deserialized);
});
