import React, { useEffect, useCallback, useState } from 'react';
import { SyncAltIcon } from '@patternfly/react-icons';
import { useParams, useRouteMatch } from 'react-router-dom';
import { t } from '@lingui/macro';
import { withI18n } from '@lingui/react';
import {
  FormGroup,
  TextInput,
  InputGroup,
  Button,
} from '@patternfly/react-core';
import ContentError from '@components/ContentError';
import ContentLoading from '@components/ContentLoading';
import useRequest from '@util/useRequest';
import { useField } from 'formik';
import { FormColumnLayout } from '@components/FormLayout';
import { CredentialLookup } from '@components/Lookup';
import AnsibleSelect from '@components/AnsibleSelect';
import { FieldTooltip } from '@components/FormField';
import { JobTemplatesAPI, CredentialTypesAPI } from '@api';

function WebhookSubForm({ i18n, enableWebhooks }) {
  const [contentError, setContentError] = useState(null);
  const jtAddMatch = useRouteMatch('/templates/job_template/add');
  const { id } = useParams();

  const { origin } = document.location;

  const [
    webhookServiceField,
    webhookServiceMeta,
    webhookServiceHelpers,
  ] = useField('webhook_service');

  const [webhookUrlField, , webhookUrlHelpers] = useField('webhook_url');
  const [webhookKeyField, webhookKeyMeta, webhookKeyHelpers] = useField(
    'webhook_key'
  );
  const [
    webhookCredentialField,
    webhookCredentialMeta,
    webhookCredentialHelpers,
  ] = useField('webhook_credential');

  const {
    request: loadCredentialType,
    error,
    isLoading,
    result: credTypeId,
  } = useRequest(
    useCallback(async () => {
      let results;
      if (webhookServiceField.value) {
        results = await CredentialTypesAPI.read({
          namespace: `${webhookServiceField.value}_token`,
        });
        // TODO: Consider how to handle the situation where the results returns
        // and empty array, or any of the other values is undefined or null (data, results, id)
      }
      return results?.data?.results[0]?.id;
    }, [webhookServiceField.value])
  );

  useEffect(() => {
    loadCredentialType();
  }, [loadCredentialType]);

  useEffect(() => {
    webhookServiceHelpers.setValue(webhookServiceField.initialValue || '');
    webhookUrlHelpers.setValue(webhookUrlField.initialValue || '');
    webhookKeyHelpers.setValue(webhookKeyField.initialValue || '');
    webhookCredentialHelpers.setValue(webhookCredentialField.initialValue || null);
  }, [enableWebhooks]);

  const changeWebhookKey = async () => {
    try {
      const {
        data: { webhook_key: key },
      } = await JobTemplatesAPI.updateWebhookKey(id);
      webhookKeyHelpers.setValue(key);
    } catch (err) {
      setContentError(err);
    }
  };

  const webhookServiceOptions = [
    {
      value: '',
      key: '',
      label: i18n._(t`Choose a Webhook Service`),
      isDisabled: true,
    },
    {
      value: 'github',
      key: 'github',
      label: i18n._(t`GitHub`),
      isDisabled: false,
    },
    {
      value: 'gitlab',
      key: 'gitlab',
      label: i18n._(t`GitLab`),
      isDisabled: false,
    },
  ];

  if (error || contentError) {
    return <ContentError error={error} />;
  }
  if (isLoading) {
    return <ContentLoading />;
  }
  return (
    enableWebhooks && (
      <FormColumnLayout>
        <FormGroup
          name="webhook_service"
          fieldId="webhook_service"
          helperTextInvalid={webhookServiceMeta.error}
          label={i18n._(t`Webhook Service`)}
        >
          <FieldTooltip content={i18n._(t`Select a webhook service.`)} />
          <AnsibleSelect
            {...webhookServiceField}
            id="webhook_service"
            data={webhookServiceOptions}
            onChange={(event, val) => {
              webhookServiceHelpers.setValue(val);
              webhookUrlHelpers.setValue(
                `${origin}/api/v2/job_templates/${id}/${val}/`
              );
              if (val === webhookServiceMeta.initialValue || val === '') {
                webhookKeyHelpers.setValue(webhookKeyMeta.initialValue);
                webhookCredentialHelpers.setValue(
                  webhookCredentialMeta.initialValue
                );
              } else {
                webhookKeyHelpers.setValue(
                  i18n
                    ._(t`a new webhook key will be generated on save.`)
                    .toUpperCase()
                );
                webhookCredentialHelpers.setValue(null);
              }
            }}
          />
        </FormGroup>
        {!jtAddMatch && (
          <>
            <FormGroup
              type="text"
              fieldId="jt-webhookURL"
              label={i18n._(t`Webhook URL`)}
              name="webhook_url"
            >
              <FieldTooltip
                content={i18n._(
                  t`Webhook services can launch jobs with this workflow job template by making a POST request to this URL.`
                )}
              />
              <TextInput
                id="t-webhookURL"
                aria-label={i18n._(t`Webhook URL`)}
                value={webhookUrlField.value}
                isReadOnly
              />
            </FormGroup>
            <FormGroup
              label={i18n._(t`Webhook Key`)}
              fieldId="template-webhook_key"
            >
              <FieldTooltip
                content={i18n._(
                  t`Webhook services can use this as a shared secret.`
                )}
              />
              <InputGroup>
                <TextInput
                  id="template-webhook_key"
                  isReadOnly
                  aria-label="wfjt-webhook-key"
                  value={webhookKeyField.value}
                />
                <Button
                  variant="tertiary"
                  aria-label={i18n._(t`Update webhook key`)}
                  onClick={changeWebhookKey}
                >
                  <SyncAltIcon />
                </Button>
              </InputGroup>
            </FormGroup>
          </>
        )}
        {credTypeId && (
          <CredentialLookup
            label={i18n._(t`Webhook Credential`)}
            tooltip={i18n._(
              t`Optionally select the credential to use to send status updates back to the webhook service.`
            )}
            credentialTypeId={credTypeId}
            onChange={value => {
              webhookCredentialHelpers.setValue(value || null);
            }}
            isValid={!webhookCredentialMeta.error}
            helperTextInvalid={webhookCredentialMeta.error}
            value={webhookCredentialField.value}
          />
        )}
      </FormColumnLayout>
    )
  );
}
export default withI18n()(WebhookSubForm);
