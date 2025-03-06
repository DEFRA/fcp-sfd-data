#!/bin/bash
aws --endpoint-url=http://localhost:4566 sns create-topic --name fcp_sfd_data.fifo --attributes "FifoTopic=true"
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name fcp_sfd_data_ingest-deadletter.fifo --attributes "FifoQueue=true"
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name fcp_sfd_data_ingest.fifo --attributes "{\"FifoQueue\": \"true\",\"RedrivePolicy\": \"{\\\"deadLetterTargetArn\\\":\\\"arn:aws:sqs:eu-west-2:000000000000:fcp_sfd_data_ingest-deadletter.fifo\\\",\\\"maxReceiveCount\\\":\\\"10\\\"}\"}"
aws --endpoint-url=http://localhost:4566 sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:fcp_sfd_data.fifo --protocol sqs --notification-endpoint arn:aws:sqs:eu-west-2:000000000000:fcp_sfd_data_ingest.fifo
