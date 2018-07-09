#!/bin/bash

PROJECT_NAME=SUD-notification-api
PROJECT_VER=1.0

RESULT_FILE=${PROJECT_NAME}-${PROJECT_VER}
TEMP_FILE=${PROJECT_NAME}-${PROJECT_VER}-${BUILD_NUMBER}

echo "You need yarn and fortify installed for this script to work."
read -p "Continue? (Y/n): " continue
if [[ "${continue:0:1}" == "n" || "${continue:0:1}" == "N" ]]; then
	echo "Aborting..."
	exit 1
fi

echo "=========================="
echo "Installing dependencies"
yarn 

echo "=========================="
echo "Copying default .env"
cp .env.example .env

echo "=========================="
echo "Building..."
yarn build

echo "=========================="
echo "Updating rulepacks"
fortifyupdate

echo "=========================="
echo "Cleaning"
sourceanalyzer -clean

echo "=========================="
echo "Scanning"
sourceanalyzer -scan -f $TEMP_FILE.fpr -Xmx8092M ./dist

echo "=========================="
echo "Merging"
EXISTING_FPR_FILE=$(find ./fortify -name "*.fpr")
if [ -z "${EXISTING_FPR_FILE}" ]; then
	echo "No existing scan found. No merging performed."
	mv $TEMP_FILE.fpr $RESULT_FILE.fpr
else
	echo "Merging existing fortify file $EXISTING_FPR_FILE into new scan."
	FPRUtility -merge -project $EXISTING_FPR_FILE -source $TEMP_FILE.fpr -f $RESULT_FILE.fpr
	rm $TEMP_FILE.fpr
fi

echo "=========================="
echo "Generating reports $RESULT_FILE"
ReportGenerator -user builduser -template Security_Report.xml -format pdf -f $RESULT_FILE.pdf -source $RESULT_FILE.fpr || true;
