import { module, test } from 'qunit';
import schemas from 'npm:kosmos-schemas';
import tv4 from 'npm:tv4';
import ContributionSerializer from 'kredits-web/lib/kredits/serializers/contribution';

module('Serializers contribution', function() {
  test('#serialize returns a valid JSON-LD representation', function(assert) {
    let serialized = ContributionSerializer.serialize({
      kind: 'design',
      description: 'New logo design',
      url: 'http://opensourcedesign.org',
      contributorIpfsHash: 'QmT2A7rY4e7uoKktkcFHQNN7BD1oXdZTgd8wNkr1u9nNVE'
    });

    let valid = tv4.validate(JSON.parse(serialized), schemas['contribution']);
    assert.ok(valid);
  });

  test('#deserialize returns a valid object representation', function(assert) {
    let json = JSON.stringify({
      "@context": "https://schema.kosmos.org",
      "@type": "Contribution",
      "contributor": {
        "ipfs": "QmT2A7rY4e7uoKktkcFHQNN7BD1oXdZTgd8wNkr1u9nNVE"
      },
      "kind": "design",
      "description": "New logo design",
      "details": {},
      "url": "http://opensourcedesign.org"
    });
    let deserialized = ContributionSerializer.deserialize(json);

    let expected = {
      kind: 'design',
      description: 'New logo design',
      details: {},
      url: 'http://opensourcedesign.org',
      ipfsData: json,
    };
    assert.deepEqual(expected, deserialized);
  });
});
