declare -a maidens=("colette" "maria" "sora")

for m in "${maidens[@]}"
do
	git checkout $m
	git pull
	git rebase live
done