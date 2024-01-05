import { Injectable } from '@nestjs/common';
import fetch, { RequestInit } from 'node-fetch';
import { ConfigService } from '@nestjs/config';

import { AudioTtsResponse } from './types';
import { UniTalkConfig } from 'config/interfaces';
import { SMS } from 'value_object/sms';
import { Audio } from 'value_object/audio';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

@Injectable()
export class UnitalkService {
	private config: UniTalkConfig;

	constructor(private readonly configService: ConfigService) {
		this.config = configService.get('uniTalk') as UniTalkConfig;
	}

	public async createNewAudio(audio: Audio): Promise<Audio> {
		const path = 'audio/tts';

		const body = {
			data: [
				{
					name: (Math.random() * 16).toString(),
					type: 'API',
					tts: {
						text: audio.text,
						settingsId: this.config.voiceSettingsId,
					},
				},
			],
		};

		const result = await this.request<AudioTtsResponse>(path, 'POST', body);

		audio.id = result?.data[0].id;

		return audio;
	}

	public async enqueueCall(to: string, audio: Audio, meta?: Record<string, any>): Promise<void> {
		const path = 'calls/originateNew';

		const body = {
			phone: to,
			meta: JSON.stringify(meta), // can be used for webhooks
			ivrId: 1240,
			audios: [
				{
					id: audio.id,
				},
			],
		};

		await this.request(path, 'POST', body);
	}

	public async sendSMS(sms: SMS): Promise<void> {
		const path = 'message/send';

		const body = {
			messageType: 'SMS',
			to: sms.user.phone,
			text: sms.text,
		};

		await this.request(path, 'POST', body);
	}

	private async request<T>(path: string, method: RequestMethod, body?: any): Promise<T> {
		const url = new URL(path, 'https://api.unitalk.cloud:8443/tracking/api/');

		const options: RequestInit = {
			method: method,
			agent: new (require('https').Agent)({ rejectUnauthorized: false }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: this.config.apiKey,
			},
		};

		if (body) {
			options['body'] = JSON.stringify(body);
		}

		const response = await fetch(url.toString(), options);
		return (await response.json()) as T;
	}
}