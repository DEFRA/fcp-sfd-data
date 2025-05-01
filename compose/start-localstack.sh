#!/bin/bash
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name fcp_sfd_data_ingest-deadletter
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name fcp_sfd_data_ingest --attributes "{\"RedrivePolicy\": \"{\\\"deadLetterTargetArn\\\":\\\"arn:aws:sqs:eu-west-2:000000000000:fcp_sfd_data_ingest-deadletter\\\",\\\"maxReceiveCount\\\":\\\"10\\\"}\"}"