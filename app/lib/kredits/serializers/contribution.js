/**
 * Handle serialization for JSON-LD object of the contribution, according to
 * https://github.com/67P/kosmos-schemas/blob/master/schemas/contribution.json
 *
 * @class
 * @public
 */
export default class Contributor {
 /**
  * Deserialize JSON to object
  *
  * @method
  * @public
  */
  static deserialize(serialized) {
    let {
      kind,
      description,
      details,
      url,
    } = JSON.parse(serialized.toString('utf8'));

    return {
      kind,
      description,
      details,
      url,
      ipfsData: serialized,
    };
  }

 /**
  * Serialize object to JSON
  *
  * @method
  * @public
  */
  static serialize(deserialized) {
    let {
      contributorIpfsHash,
      kind,
      description,
      url,
    } = deserialized;

    let data = {
      "@context": "https://schema.kosmos.org",
      "@type": "Contribution",
      "contributor": {
        "ipfs": contributorIpfsHash
      },
      kind,
      description,
      "details": {}
    };

    if (url) {
      data["url"] = url;
    }

    // Write it pretty to ipfs
    return JSON.stringify(data, null, 2);
  }
}
