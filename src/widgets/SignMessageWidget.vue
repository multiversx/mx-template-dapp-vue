<template>
  <div class="flex flex-col gap-6">
    <div class="flex gap-2 items-start">
      <Button
        v-if="state === 'success' || state === 'error'"
        dataTestId="closeTransactionSuccessBtn"
        id="closeButton"
        @click="handleClear"
      >
        <font-awesome-icon :icon="state === 'error' ? faRotateRight : faBroom" />
      </Button>

      <Button
        v-if="state === 'pending'"
        dataTestId="signMsgBtn"
        @click="handleSubmit"
        :disabled="!message.trim()"
      >
        <font-awesome-icon :icon="faPen" />
        Sign
      </Button>
    </div>

    <OutputContainer :className="'p-0 border-0'">
      <div v-if="state === 'pending'">
        <textarea
          v-model="message"
          placeholder="Write message here"
          class="resize-none w-full h-32 rounded-lg focus:outline-none focus:border-blue-500 p-2 border border-gray-300"
        ></textarea>
      </div>

      <div v-if="state === 'success' && signedMessage">
        <div class="flex flex-col gap-6">
          <div class="flex flex-col w-full">
            <div class="flex flex-row w-full gap-2 mb-2">
              <Label>Signature:</Label>
              <textarea
                readonly
                class="flex-1 resize-none outline-none bg-transparent border border-gray-300 rounded p-2"
                rows="2"
                :value="signature"
              ></textarea>
            </div>

            <div class="flex flex-row w-full gap-2 mb-2">
              <Label>Encoded message:</Label>
              <p class="flex-1 p-2 bg-gray-50 rounded">{{ encodedMessage }}</p>
            </div>

            <div class="flex flex-row w-full gap-2">
              <Label>Decoded message:</Label>
              <textarea
                readonly
                class="flex-1 resize-none outline-none text-green-700 bg-transparent border border-gray-300 rounded p-2"
                rows="1"
                :value="decodedMessage"
                placeholder="Decoded message"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div v-if="state === 'error'" class="text-red-600">
        <p>Message could not be signed</p>
        <p>Reason: An error occurred during signing</p>
      </div>
    </OutputContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPen, faBroom, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import { getAccountProvider } from '@multiversx/sdk-dapp/out/providers/helpers/accountProvider';
import { Message } from '@multiversx/sdk-core/out';
import OutputContainer from '../components/OutputContainer.vue';
import Label from '../components/Label.vue';
import Button from '../components/Button.vue';

const message = ref('');
const signedMessage = ref<any>(null);
const state = ref<'pending' | 'success' | 'error'>('pending');
const signature = ref('');
const address = ref('');

async function handleSubmit() {
  try {
    // Get the account data from the store
    const account = getAccount();
    address.value = account.address || '';

    if (!address.value) {
      console.error('No account address found');
      state.value = 'error';
      return;
    }

    console.log('Signing message:', message.value);

    // Create a Message object from the message
    const messageToSign = new Message({
      data: Buffer.from(message.value, 'utf8'),
    });

    // Get the account provider and sign the message
    const provider = getAccountProvider();
    const signed = await provider.signMessage(messageToSign);

    if (!signed) {
      console.error('No signed message found');
      state.value = 'error';
      return;
    }

    // Extract the signature from the signed message
    signature.value = signed.signature
      ? Buffer.from(signed.signature).toString('hex')
      : '';
    state.value = 'success';
    signedMessage.value = signed;
    message.value = '';
  } catch (error) {
    console.error('Error signing message:', error);
    state.value = 'error';
  }
}

function handleClear(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
  signature.value = '';
  signedMessage.value = null;
  state.value = 'pending';
  message.value = '';
}

const encodedMessage = computed(() => {
  if (!signedMessage.value) return '';
  return (
    '0x' +
    Array.from(signedMessage.value.data, (byte: number) =>
      byte.toString(16).padStart(2, '0')
    ).join('')
  );
});

const decodedMessage = computed(() => {
  if (!signedMessage.value) return '';
  return new TextDecoder().decode(signedMessage.value.data);
});
</script> 