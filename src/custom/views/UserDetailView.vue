<template>
  <section class="user-detail-container flex-1">
    <div class="user-header-content-container">
      <div class="header">
        <div>
          <img class="avatar" :src="user.portrait || defaultAvatar" />
        </div>
        <div class="name">
          <div style="display: flex; align-items: center">
            <h2>{{ name }}</h2>
            <p
              v-if="isExternalDomainUser"
              class="single-line"
              style="color: #f0a040; border-radius: 2px; padding: 1px 2px; font-size: 9px"
            >
              {{ domainName }}
            </p>
          </div>
          <!-- <p>你好，野火</p> -->
        </div>
      </div>
      <div class="content">
        <ul>
          <li>
            <label>{{ $t('common.alias') }}</label>
            <div class="alias">
              <input
                type="text"
                ref="inputRef"
                :value="user.friendAlias"
                placeholder="备注名"
                @keyup.enter="updateFriendAlias"
              />
            </div>
          </li>
          <li>
            <label>{{ $t('common.wfc_id') }}</label>
            <p>{{ user.uid }}</p>
          </li>
          <li>
            <label>部门</label>
            <p>{{ extraInfo.deptName }}</p>
          </li>
          <li>
            <label>电话</label>
            <p>{{ user.mobile }}</p>
          </li>
        </ul>
      </div>
      <div class="footer">
        <div class="action" @click="chat">
          <i class="icon-ion-ios-chatboxes-outline"></i>
          <a>{{ $t('message.send_message') }}</a>
        </div>
        <!-- <div class="action" @click="startAudioCall">
          <i class="icon-ion-ios-telephone-outline"></i>
          <a>语音通话</a>
        </div>
        <div class="action" @click="startVideoCall">
          <i class="icon-ion-ios-videocam-outline"></i>
          <a>视频通话</a>
        </div> -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import store from '../../store';
import ConversationType from '../../wfc/model/conversationType';
import Conversation from '../../wfc/model/conversation';
import wfc from '../../wfc/client/wfc';
import WfcUtil from '../../wfc/util/wfcUtil';
import Config from '../../config';

// 接收父组件传递的用户信息
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

// 默认头像
const defaultAvatar = ref(Config.DEFAULT_PORTRAIT_URL);

// 聊天功能
function chat() {
  let conversation = new Conversation(ConversationType.Single, props.user.uid, 0);
  store.setCurrentConversation(conversation);
  window.location.href = '/#/home';
}

// 更新好友备注
const inputRef = ref(null);
function updateFriendAlias() {
  let friendAlias = inputRef.value?.value;
  if (friendAlias?.trim() && friendAlias !== props.user.friendAlias) {
    wfc.setFriendAlias(
      props.user.uid,
      friendAlias,
      () => {
        console.log('setFriendAlias success', props.user, friendAlias);
      },
      (error) => {
        console.error('setFriendAlias failed', error);
      }
    );
  }
  inputRef.value?.blur();
}

// 开始语音通话
function startAudioCall() {
  let conversation = new Conversation(ConversationType.Single, props.user.uid, 0);
  if (window.$startVoipCall) {
    window.$startVoipCall({ audioOnly: true, conversation: conversation });
  }
}

// 开始视频通话
function startVideoCall() {
  let conversation = new Conversation(ConversationType.Single, props.user.uid, 0);
  if (window.$startVoipCall) {
    window.$startVoipCall({ audioOnly: false, conversation: conversation });
  }
}

// 计算属性：用户名称
const name = computed(() => {
  let name;
  if (props.user.displayName) {
    name = props.user.displayName;
  } else {
    name = props.user.uid;
  }
  // 获取用户信息
  (async () => {
    wfc.getUserInfo(props.user.uid, true);
  })();
  return name;
});

// 计算属性：是否为外部域用户
const isExternalDomainUser = computed(() => {
  return WfcUtil.isExternal(props.user.uid);
});

// 计算属性：域名名称
const domainName = computed(() => {
  if (WfcUtil.isExternal(props.user.uid)) {
    let domainId = WfcUtil.getExternalDomainId(props.user.uid);
    let domainInfo = wfc.getDomainInfo(domainId);
    return '@' + domainInfo.name;
  }
  return '';
});

// 计算属性：额外信息
const extraInfo = computed(() => {
  const extra = JSON.parse(props.user.extra || '{}');
  return extra;
});
</script>

<style lang="css" scoped>
.user-detail-container {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow-y: auto;
  padding: 0 20px;
}

.user-header-content-container {
  width: 400px;
}

.header {
  margin-top: 60px;
  height: 75px;
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #e6e6e6;
}

.header .avatar {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  margin-right: 20px;
  object-fit: cover;
}

.header .name {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.header .name h2 {
  font-size: 15px;
  font-style: normal;
  font-weight: normal;
  margin: 0;
}

.header .name p {
  font-size: 13px;
  color: #7f7f7f;
  margin: 0;
}

.content {
  width: 100%;
  text-align: left;
  border-bottom: 1px solid #e6e6e6;
}

.content ul {
  list-style: none;
  margin: 20px 0 10px 0;
  padding: 0;
}

.content ul li {
  margin-left: 0;
  height: 40px;
  line-height: 40px;
  display: flex;
  font-size: 12px;
}

.content ul li label {
  margin-right: 20px;
  width: 40px;
  text-align: justify;
  text-align-last: justify;
  color: #7f7f7f;
}

.content ul li p {
  font-size: 12px;
  margin: 0;
}

.content ul li .alias > input {
  width: 100%;
  border: none;
  border-radius: 3px;
  outline: none;
  /* padding: 5px; */
  color: #bfbfbf;
  font-size: 13px;
}

.content ul li .alias > input:active {
  border: 1px solid #4168e0;
}

.content ul li .alias input:focus {
  border: 1px solid #4168e0;
}

.content ul li > div {
  display: inline-block;
  flex: 1;
}

.footer {
  display: flex;
  justify-content: center;
  padding-top: 30px;
}

.footer .action {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: #5d7ce8;
  cursor: pointer;
}

.footer .action a {
  font-size: 10px;
  padding-top: 1px;
  text-decoration: none;
  color: inherit;
}

.footer .action i {
  font-size: 20px;
}
</style>
