require("dotenv").config();
const fetch = require("node-fetch");
const { download_image } = require("../lib/fileControler");

const auth = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

const request = async (url, auth) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${auth.username}:${auth.password}`
        ).toString("base64")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Can't abel to get respons from Word press API");
    }

    const result = response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

const get_data_from_wpapi = async (url="https://privatemoviez.icu/greedy-people-2024-hin-eng-webrip-720p-1080p/") => {
  try {
    var URL_SLUG = url.split("/");
    URL_SLUG = URL_SLUG[URL_SLUG.length - 2];

    var POST_DATA_RAW = (
      await request(
        `${process.env.DOMAIN}${process.env.END_POINT}posts?slug=${URL_SLUG}`,
        auth
      )
    )[0];
    var POST_DATA_CLEAN = {
      post_id: POST_DATA_RAW.id,
      title: POST_DATA_RAW.title.rendered,
      post_slug: URL_SLUG,
    };

    var content = POST_DATA_RAW.content.rendered
      .split("\n")[1]
      .split("<p>")[1]
      .split("</p>")[0];

    if (content.length > 800) {
      content = content.slice(0, 799);
    }
    
    POST_DATA_CLEAN.content = content;
    POST_DATA_CLEAN.image_source_url = null;
    POST_DATA_CLEAN.image_slug = null;

    var MEDIA_IMAGE = undefined;

    if (POST_DATA_RAW.featured_media) {
      MEDIA_IMAGE = await request(
        `${process.env.DOMAIN}${process.env.END_POINT}media/${POST_DATA_RAW.featured_media}`,
        auth
      );
      POST_DATA_CLEAN.image_source_url = MEDIA_IMAGE.source_url;
      var image_slug = POST_DATA_CLEAN.image_source_url.split("/");
      image_slug = image_slug[image_slug.length - 1];
      POST_DATA_CLEAN.image_slug = image_slug;
    }
    await download_image(POST_DATA_CLEAN.image_source_url,`${process.cwd()}${process.env.MEDIA_PATH}/${POST_DATA_CLEAN.image_slug}`);
    
    POST_DATA_CLEAN.image_path = `${process.cwd()}${process.env.MEDIA_PATH}/${POST_DATA_CLEAN.image_slug}`;

    return POST_DATA_CLEAN;
  } catch (error) {
    throw error;
  }
};



module.exports = {get_data_from_wpapi};
