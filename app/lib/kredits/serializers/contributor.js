/**
 * Handle serialization for JSON-LD object of the contributor, according to
 * https://github.com/67P/kosmos-schemas/blob/master/schemas/contributor.json
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
      name,
      kind,
      url,
      accounts,
    } = JSON.parse(serialized.toString('utf8'));

    let github_username, github_uid, wiki_username;
    let github = accounts.find((a) => a.site === 'github.com');
    let wiki   = accounts.find((a) => a.site === 'wiki.kosmos.org');

    if (github) {
      ({ username: github_username, uid: github_uid} = github);
    }
    if (wiki) {
      ({ username: wiki_username } = wiki);
    }

    return {
      name,
      kind,
      url,
      github_uid,
      github_username,
      wiki_username,
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
      name,
      kind,
      url,
      github_uid,
      github_username,
      wiki_username,
    } = deserialized;

    let data = {
      "@context": "https://schema.kosmos.org",
      "@type": "Contributor",
      kind,
      name,
      "accounts": []
    };

    if (url) {
      data["url"] = url;
    }

    if (github_uid) {
      data.accounts.push({
        "site": "github.com",
        "uid": github_uid,
        "username": github_username,
        "url": `https://github.com/${github_username}`
      });
    }

    if (wiki_username) {
      data.accounts.push({
        "site": "wiki.kosmos.org",
        "username": wiki_username,
        "url": `https://wiki.kosmos.org/User:${wiki_username}`
      });
    }

    // Write it pretty to ipfs
    return JSON.stringify(data, null, 2);
  }
}
