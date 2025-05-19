#!/bin/bash
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name fcp_sfd_comms_request-deadletter
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name fcp_sfd_comms_request --attributes "{\"RedrivePolicy\": \"{\\\"deadLetterTargetArn\\\":\\\"arn:aws:sqs:eu-west-2:000000000000:fcp_sfd_comms_request-deadletter\\\",\\\"maxReceiveCount\\\":\\\"10\\\"}\"}"
aws --endpoint-url=http://localhost:4566 sns create-topic --name fcp_sfd_comm_events

aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name fcp_sfd_data_ingest-deadletter
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name fcp_sfd_data_ingest --attributes "{\"RedrivePolicy\": \"{\\\"deadLetterTargetArn\\\":\\\"arn:aws:sqs:eu-west-2:000000000000:fcp_sfd_data_ingest-deadletter\\\",\\\"maxReceiveCount\\\":\\\"10\\\"}\"}"
aws --endpoint-url=http://localhost:4566 sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:fcp_sfd_comm_events --protocol sqs --notification-endpoint arn:aws:sqs:eu-west-2:000000000000:fcp_sfd_data_ingest
