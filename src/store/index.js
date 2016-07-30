import _ from 'lodash';
import { EventEmitter } from 'events';
import { Promise } from 'es6-promise';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

import config from '../../config.json';

firebase.initializeApp(config.firebase);

const database = firebase.database();
const storage = firebase.storage();
const store = new EventEmitter();

const uploadImage = file => new Promise((resolve, reject) => {
  const uploadTask = storage.ref().child(`images/${file.name}`).put(file);

  uploadTask.on(
    'state_changed',
    null,
    error => reject(error),
    () => resolve(uploadTask.snapshot.downloadURL)
  );
});

store.getAppByTitle = title => database
  .ref('apps')
  .orderByChild('title')
  .equalTo(title)
  .once('value')
  .then(snapshot => snapshot.val());

store.getAppById = appId => database
  .ref(`apps/${appId}`)
  .once('value')
  .then(snapshot => snapshot.val());

store.saveApp = (app, existingAppId) => {
  const getAppId = () => (
    existingAppId
      ? Promise.resolve(existingAppId)
      : store
        .getAppByTitle(app.title)
        .then(existingApp => {
          if (existingApp) {
            return Promise.reject(
              'An app with this title already exists. Please edit it instead.'
            );
          }

          return firebase
            .database()
            .ref()
            .child('apps')
            .push()
            .key;
        })
    );

  return getAppId()
    .then(appId => {
      const saveIcon = app.iconFile
        ? uploadImage(app.iconFile)
        : Promise.resolve(app.iconUrl);
      const saveMemberPhotos = Promise.all(app.teamMembers
        .map(teamMember => (
          teamMember.photoFile
            ? uploadImage(teamMember.photoFile)
            : Promise.resolve(teamMember.photoUrl)
        ))
      );

      return Promise
        .all([saveIcon, saveMemberPhotos])
        .then(([iconUrl, teamMemberPhotoUrls]) => database
          .ref(`apps/${appId}`)
          .set({
            title: app.title,
            description: app.description,
            websiteUrl: app.websiteUrl,
            appStoreId: app.appStoreId,
            googlePlayId: app.googlePlayId,
            iconUrl,
            iconColor: app.iconColor,
            teamMembers: _.map(
              app.teamMembers,
              (teamMember, idx) => ({
                name: teamMember.name,
                bio: teamMember.bio,
                photoUrl: teamMemberPhotoUrls[idx]
              })
            )
          })
        );
    });
};

store.getApps = () => database
  .ref('apps')
  .once('value')
  .then(snapshot => _.map(
    snapshot.val(),
    (app, id) => _.assign(app, { id })
  ));

export default store;
