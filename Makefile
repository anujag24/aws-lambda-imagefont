.PHONY: test test-local test-deployed

test:
	pytest tests/ -v --cov=src

test-local:
	chmod +x test_locally.sh
	./test_locally.sh

test-deployed:
	python test_deployed.py

