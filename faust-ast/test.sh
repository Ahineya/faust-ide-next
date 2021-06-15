for file in ./faust-libraries/*
do
  bash parse.sh $file >> ./out/$file.out
done

find . -name 'out/*.out' -exec sh -c "cat {} | head" \;