import Router from 'vue-router';
import Vue from 'vue';

import App from './components/App.vue';
import DemodayView from './components/DemodayView.vue';
import EditEntryListView from './components/EditEntryListView.vue';
import EditEntryView from './components/EditEntryView.vue';
import SubmissionMenuView from './components/SubmissionMenuView.vue';

Vue.use(Router);
Vue.transition('fade', {
  enterClass: 'fadeIn',
  leaveClass: 'fadeOut'
});

const router = new Router({ transitionOnLoad: true });

router.map({
  '/': { component: DemodayView },
  '/submission': { component: SubmissionMenuView },
  '/submission/list': { component: EditEntryListView },
  '/submission/new': { component: EditEntryView },
  '/submission/:appId': { component: EditEntryView }
});

router.start(App, 'app');
